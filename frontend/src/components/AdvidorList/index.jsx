import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";

const AdvisorList = () => {
  const [additionalData, setAdditionalData] = useState([]);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const freefetchAdditional = async (targetModel, id = null) => {
    try {
      const response = await PrivateDefaultApi.post("free_model/", {
        model: targetModel,
        id: id,
      });
      rootStore.holosticScheduleContentStore.addadditionallyFetchedData({
        target: targetModel,
        data: response.data
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const models = ["faculty", "department", "program", "lecturer", "title", "advisor"];
      const fetchPromises = models.map((model) => freefetchAdditional(model));
      try {
        await Promise.all(fetchPromises);
        setAdditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching additional data: ", error);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    const getAddD = async (id) => {
      await freefetchAdditional("users", id);
      return additionalData.filter((ad) => ad.target === "users").at(-1)?.data;
    };

    if (loaded && additionalData.find((ad) => ad.target === "advisor")) {
      const advisorList = additionalData.find((ad) => ad.target === "advisor")?.data;
      const buildData = async () => {
        const tore = [];
        for (const ad of advisorList) {
          const y = await getAddD(ad.user);
          if (y) {
            const title = additionalData.find((a) => a.target === "title")?.data.find((d) => d.id === y.title);
            const program = additionalData.find((a) => a.target === "program")?.data.filter((d) => y.program.includes(d.id));
            tore.push({
              id: ad.id,
              title: title?.shortname || "N/A",
              first_name: y.first_name || "N/A",
              last_name: y.last_name || "N/A",
              program: program?.map((p) => p.name).join(", ") || "N/A",
            });
          }
        }
        setData(tore);
      };
      buildData();
    }
  }, [loaded, additionalData]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Program(s)",
      dataIndex: "program",
      key: "program",
    },
  ];

  return (
    <>
      <Card title={<span>Advisors</span>} className="new-preview">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </>
  );
};

export default AdvisorList;
