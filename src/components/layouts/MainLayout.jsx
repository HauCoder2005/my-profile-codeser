import Header from "./header/Header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main id="top">{children}</main>
    </>
  );
};

export default MainLayout;
