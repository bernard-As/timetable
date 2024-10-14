import { Card, List, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";
import { observer } from "mobx-react";

const UpComingLecturesPreview = observer(() => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);

  const freefetchAdditional = (targetModel, id = null) => {
    let url = targetModel + "/";
    if (id) url = url + id + "/";
    PrivateDefaultApi.post("free_model/", {
      model: targetModel,
      id: id,
    })
      .then((res) => {
        rootStore.holosticScheduleContentStore.addadditionallyFetchedData({
          target: targetModel,
          data: res.data,
        });
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const models = [
        "building",
        "floor",
        "faculty",
        "department",
        "program",
        "semester",
        "title",
        "lecturer",
        "course",
        "activitytype",
        "coursegroup",
        "coursesemester",
      ];

      const fetchPromises = models.map((model) => freefetchAdditional(model));

      try {
        await Promise.all(fetchPromises);
        setAdditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    setAdditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData);
  }, [rootStore.holosticScheduleContentStore.additionallyFetchedData]);

  useEffect(() => {
    const getSystemNew = () => {
      PrivateDefaultApi.get("upcoming-schedule/")
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getSystemNew();
  }, [navigate]);

  return (
    <Card title={<span>Upcoming Lectures</span>} className="new-preview">
      <List
        itemLayout="horizontal"
        dataSource={data}
        style={{
          overflowY: "scroll",
          maxHeight: "320px",
        }}
        renderItem={(item, index) => {
          const courseGroup = additionalData
            .find((ad) => ad.target === "coursegroup")
            ?.data.find((d) => d.id === item.coursegroup);
          const courseId = courseGroup?.course;
          const course = additionalData
            .find((ad) => ad.target === "course")
            ?.data.find((c) => c.id === courseId);

          const courseCode = course?.code;
          const courseName = course?.name;

          return (
            <List.Item style={{ margin: "10px" }}>
              <List.Item.Meta
                title={<span>{courseCode} {courseName}</span>}
                description={
                  <span>
                    Time Range: {item.start} ~ {item.end}{" "}
                    {item.day !== null
                      ? ` Day ${
                          rootStore.holosticScheduleContentStore.daysIndex.find(
                            (d) => d.id === item.day
                          )?.name
                        }`
                      : ` Date ${item.date}`}
                  </span>
                }
                action={[<Tag color="grey">{item.created_at}</Tag>]}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
});

export default UpComingLecturesPreview;
