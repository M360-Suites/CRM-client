import { useState } from "react";

const Tabs = [
  {
    name: "General",
    value: "general",
    component: () => <div>General</div>,
  },
  {
    name: "Roles and Permissions",
    value: "roles",
    component: () => <div>Roles and Permissions</div>,
  },
];

export default function Body() {
  const [activeTab, setActiveTab] = useState("");
  return (
    <div>
      {Tabs.map((tab) => (
        <div key={tab.value}>
          <h3>{tab.name}</h3>
          {tab.component()}
        </div>
      ))}
    </div>
  );
}
