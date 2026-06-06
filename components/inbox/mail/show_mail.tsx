import React from "react";
import { useGetGmail } from "@/hooks/gmail/get_gmail";

export default function ShowMail() {
  const { data, isLoading, isError } = useGetGmail();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading emails</div>;

  return (
    <div className="flex flex-col gap-2">
      {data?.map((mail) => (
        <div key={mail._id}>
          <h2>{mail.subject}</h2>
          <p>{mail.snippet}</p>
        </div>
      ))}
    </div>
  );
}
