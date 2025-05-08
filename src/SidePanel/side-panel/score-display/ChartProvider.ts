import { singleton } from "tsyringe";
import {
  ChartConfiguration,
  ScriptableContext,
  Chart,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController,
} from "chart.js";

Chart.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController
);

type ChartCache = {
  canvas: HTMLCanvasElement;
  chart: Chart;
};

@singleton()
export class ChartProvider {
  private static START_COLORS = [
    "rgba(237, 218, 109, 1)",
    "rgba(67, 151, 157, 0.7)",
    "rgba(141, 198, 245, 0.7)",
    "rgba(131, 151, 239, 0.7)",
    "rgba(160, 130, 197, 0.7)",
    "rgba(205, 90, 101, 0.7)",
  ];

  private static END_COLORS = [
    "rgba(216, 188, 27, 0.8)",
    "rgba(47, 106, 110, 0.8)",
    "rgba(35, 145, 236, 0.8)",
    "rgba(33, 69, 226, 0.8)",
    "rgba(110, 73, 156, 0.8)",
    "rgba(158, 48, 59, 0.8)",
  ];

  private chartCache: ChartCache | undefined;

  public provideChart(canvas: HTMLCanvasElement): Chart {
    if (this.isObsoleteOrNoCache(canvas)) {
      this.chartCache = {
        canvas,
        chart: new Chart(canvas, this.getConfig(canvas)),
      };
    }
    return this.chartCache!.chart;
  }

  private isObsoleteOrNoCache(canvas: HTMLCanvasElement): boolean {
    return !this.chartCache || this.chartCache.canvas !== canvas;
  }

  private getConfig(
    canvas: HTMLCanvasElement
  ): ChartConfiguration<"polarArea"> {
    return {
      type: "polarArea",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: ["rgba(0,0,0,0.1)"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          r: {
            grid: {
              color: () =>
                getComputedStyle(canvas).getPropertyValue("--chart-label"),
            },
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 14,
              },
              color: () =>
                getComputedStyle(canvas).getPropertyValue("--text-color"),
            },
            min: 0,
            max: 100,
            ticks: {
              display: false,
              stepSize: 25,
            },
          },
        },
        elements: {
          arc: {
            backgroundColor: (context) => {
              const start = ChartProvider.START_COLORS[context.dataIndex];
              const mid = ChartProvider.END_COLORS[context.dataIndex];
              const end = ChartProvider.END_COLORS[context.dataIndex];
              return this.createRadialGradient3(context, start, mid, end);
            },
          },
        },
      },
    };
  }

  private createRadialGradient3(
    { chart }: ScriptableContext<"polarArea">,
    c1: string,
    c2: string,
    c3: string
  ): CanvasGradient {
    const chartArea = chart.chartArea;

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    const gradient = chart.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.8, c2);
    gradient.addColorStop(1, c3);
    return gradient;
  }
}
