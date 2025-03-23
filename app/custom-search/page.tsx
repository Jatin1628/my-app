import type { NextPage } from 'next';
import SearchComponent from '../../components/SearchComponent';

const Home: NextPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Google Search App</h1>
      <SearchComponent />
    </div>
  );
};

export default Home;
