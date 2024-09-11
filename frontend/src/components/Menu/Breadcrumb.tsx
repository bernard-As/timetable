import { Breadcrumb } from 'antd';
import { useLocation, useParams, Link } from 'react-router-dom';

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();
  let pathSnippets = location.pathname.split('/').filter(i => i);
  pathSnippets = pathSnippets.filter((p)=>p!=='home')
  const breadcrumbItems = pathSnippets.map((path, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>
          {path === 'users' && id ? `User ${id}` : path}
        </Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <Breadcrumb>
      <Breadcrumb.Item key="home">
        <Link to="/home">Home</Link>
      </Breadcrumb.Item>
      {breadcrumbItems}
    </Breadcrumb>
  );
};
export default DynamicBreadcrumbs;