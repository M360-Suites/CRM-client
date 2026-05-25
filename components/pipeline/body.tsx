"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { UserRound } from "lucide-react";
import { usePipelineStore } from "@/stores/pipeline/pipeline_store";
import { PipelineTabs } from "@/lib/utils";
import { DraggableLayout } from "./draggableLayout";
import { useEffect } from "react";

const dummyLeads = [
  {
    _id: "1",
    name: "Boluwatife Ojo",
    company: "Heemo Seams",
    value: 500000,
    stage: "leads",
  },
  {
    _id: "2",
    name: "Daniel Toby",
    company: "Jola Industries",
    value: 1200000,
    stage: "qualified",
  },
  {
    _id: "3",
    name: "Amara Nwosu",
    company: "TechBridge NG",
    value: 800000,
    stage: "leads",
  },
  {
    _id: "4",
    name: "Kemi Adeyemi",
    company: "FinServe Ltd",
    value: 2500000,
    stage: "proposals",
  },
  {
    _id: "5",
    name: "Tunde Bakare",
    company: "Cowork Lagos",
    value: 350000,
    stage: "negotiations",
  },
  {
    _id: "6",
    name: "Sola Adebayo",
    company: "GreenTech NG",
    value: 900000,
    stage: "won",
  },
  {
    _id: "7",
    name: "Ngozi Eze",
    company: "BluePrint Co",
    value: 150000,
    stage: "lost",
  },
  {
    _id: "8",
    name: "Emeka Obi",
    company: "CapitalOne NG",
    value: 3000000,
    stage: "closed",
  },
];
export default function Body() {
  // only keep string values (prevents numeric enum entries from showing up)
  const Tabs = Object.values(PipelineTabs).filter(
    (v) => typeof v === "string",
  ) as string[];

  const { leads, setLeads } = usePipelineStore();

  useEffect(() => {
    setLeads(dummyLeads);
  }, [setLeads]); // include setter

  const safeLeads = leads ?? [];

  const leadsByStage = Tabs.reduce<Record<string, typeof safeLeads>>(
    (acc, tab) => {
      acc[tab] = safeLeads.filter(
        (lead) => (lead.stage ?? "").toLowerCase() === tab.toLowerCase(),
      );
      return acc;
    },
    {},
  );

  console.log("leadsByStage:", leadsByStage);

  return (
    <div>
      <DraggableLayout className="w-full h-full rounded-md flex items-center justify-between">
        <div className="grid grid-cols-7 w-full gap-3">
          {Tabs.map((tab) => {
            const stageLeads = leadsByStage[tab] ?? [];
            const stageValue = stageLeads.reduce(
              (sum, l) => sum + (l.value ?? 0),
              0,
            );

            return (
              <div className="flex flex-col border rounded-md w-full" key={tab}>
                <div className="border-b p-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between w-full text-foreground text-sm font-medium">
                      <span className="capitalize">{tab}</span>
                      <span>{stageLeads.length}</span>
                    </div>
                    <span className="text-foreground font-normal">
                      ₦{stageValue.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <UserRound size={18} />
                  </div>
                </div>
                <Droppable id={tab}>
                  {stageLeads.map((lead) => (
                    <Draggable key={lead._id} lead={lead} />
                  ))}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DraggableLayout>
    </div>
  );
}
