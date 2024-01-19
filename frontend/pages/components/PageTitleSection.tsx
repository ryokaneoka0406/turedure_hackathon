import React from "react";
import { Stack, PageHeading } from "smarthr-ui";

type Props = {
  title: string;
  description: string;
};

// TBD ページ名と説明をpropsで受け取る
const PageTitleSection = (props: Props) => {
  return (
    <Stack className="mb-6">
      <PageHeading>{props.title}</PageHeading>
      <p>{props.description}</p>
    </Stack>
  );
};

export default PageTitleSection;