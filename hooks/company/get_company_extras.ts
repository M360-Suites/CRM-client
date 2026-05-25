// import { useQuery } from "@tanstack/react-query";
// import {
//   GetCompanyContacts,
//   GetCompanyDeals,
//   GetCompanyStats,
// } from "@/services/company/get_company_extras";
// import { Company } from "@/types/company";

// export const useGetCompanyExtras = (id: string) => {
//   return useQuery<Company[]>({
//     queryKey: ["companies", id],
//     queryFn: () =>
//       Promise.all([
//         GetCompanyContacts(id),
//         GetCompanyDeals(id),
//         GetCompanyStats(id),
//       ]),
//     refetchInterval: 1 * 60 * 1000,
//   });
// };
