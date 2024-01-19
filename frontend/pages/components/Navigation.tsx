import React from "react";
import { Header, AppNavi } from "smarthr-ui";
import "smarthr-ui/smarthr-ui.css";
import { CssBaseLine } from "smarthr-normalize-css";
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  const buttons = [
    {
      children: "会議",
      current: router.pathname === "/" || /\/m\/.*/.test(router.pathname),
      href: "/",
    },
    {
      children: "会議データ",
      current: router.pathname === "/analytics",
      href: "/analytics",
    },
    {
      children: "お試し機能",
      current: router.pathname === "/beta",
      href: "/beta",
    },
  ];
  return (
    <>
      <CssBaseLine />
      <Header
        tenants={[{ id: "smart-hr", name: <span>ペンギン株式会社</span> }]}
        currentTenantId="smarthr"
      ></Header>
      <AppNavi label="AI議事録" buttons={buttons}></AppNavi>
    </>
  );
};

export default Navigation;