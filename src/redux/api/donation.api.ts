import { createApi } from "@reduxjs/toolkit/query/react";
import { AppBaseQuery } from "../../utils";
import { IDonationProps, SendMailProps } from "../../interface";

const DonationApi = createApi({
     baseQuery: AppBaseQuery,
     reducerPath: "donationApi",
     endpoints: ({ query, mutation }) => ({
          GetAllDonations: query<{ data: IDonationProps[] }, void>({
               query: () => `/donation/all`,
          }),
          GetDonationById: query<{ data: IDonationProps }, string>({
               query: (id) => `/donations/${id}`,
          }),
          SendingMail: mutation<{ data: any }, SendMailProps>({
               query: (payload) => {
                    return {
                         url: `/donations/send-mail`,
                         body: { ...payload },
                         method: "POST",
                    };
               },
          }),
          ManualEntryForDonation: mutation<{ data: string }, IDonationProps>({
               query: (payload) => {
                    return {
                         url: "/donation/manual",
                         method: "POST",
                         body: { ...payload },
                    };
               },
          }),
     }),
});

export const DonationApiReducer = DonationApi.reducer;
export const DonationApiMiddleware = DonationApi.middleware;
export const {
     useLazyGetAllDonationsQuery,
     useLazyGetDonationByIdQuery,
     useSendingMailMutation,
     useGetAllDonationsQuery,
     useGetDonationByIdQuery,
     useManualEntryForDonationMutation,
} = DonationApi;
