import * as React from "react";
import { useTranslation } from "react-i18next";
import { Card, Skeleton, Typography } from "antd";
import { Pie, PieConfig } from "@antv/g2plot";
import { Theme, PreferencesContext } from "api/contexts/Preferences";

const { Title } = Typography;

let versionsChart: any = null;

interface Props {
  versions: { [key: string]: string };
}

const Representatives: React.FC<Props> = ({ versions }) => {
  const { t } = useTranslation();
  const { theme } = React.useContext(PreferencesContext);

  React.useEffect(() => {
    if (!Object.keys(versions).length) return;

    const config: PieConfig = {
      padding: -18,
      data: Object.entries(versions).map(([version, value]) => ({
        version,
        value,
      })),
      angleField: "value",
      colorField: "version",
      radius: 0.8,
      label: {
        visible: true,
        type: "outer",
        style:
          theme === Theme.DARK
            ? {
                fill: "white",
                stroke: "none",
              }
            : {
                fill: "black",
                stroke: "#fff",
              },
      },
      legend: {
        visible: true,
      },
      interactions: [{ type: "element-active" }],
    };

    if (!versionsChart) {
      versionsChart = new Pie(
        document.getElementById("versions-chart") as HTMLElement,
        config,
      );
    } else {
      versionsChart.updateConfig(config);
    }

    versionsChart.render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, versions]);

  React.useEffect(() => {
    return () => {
      versionsChart = null;
    };
  }, []);

  return (
    <>
      <Title level={3}>{t("pages.status.nodeVersions")}</Title>

      <Card size="small" bordered={false} className="detail-layout">
        <Skeleton loading={!Object.keys(versions).length} active>
          <div id="versions-chart" />
        </Skeleton>
      </Card>
    </>
  );
};

export default Representatives;
