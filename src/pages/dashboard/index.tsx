import React, { useEffect, useState } from "react";
import { Layout } from "../../layout";
import { useLazyDataAnalyserQuery } from "../../redux/api/website.api";
import { useAppDispatch } from "../../redux";
import { handleError } from "../../redux/app";
import { useProfileAdminQuery } from "../../redux/api";
import { Button, DashboardCard } from "../../component";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { LuGalleryHorizontal } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { PiPenNibLight } from "react-icons/pi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChartData } from "../../chat-data/line-chart";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export const DashboardPage = () => {
     const [showCalender, setShowCalender] = useState<boolean>(false);
     const [value, onChange] = useState<Value>(new Date());
     const [GetDataAnalytics, { isError: isDataError, error: dataError, isLoading: isDataLoading, data }] =
          useLazyDataAnalyserQuery();
     const { data: profile, isError: isProfileError, error: profileError } = useProfileAdminQuery();
     const dispatch = useAppDispatch();

     useEffect(() => {
          if (isDataError) {
               if ((dataError as any).data) {
                    dispatch(handleError((dataError as any).data.message));
               } else {
                    console.log((dataError as any).error);
                    dispatch(handleError((dataError as any).error));
               }
          }
          if (isProfileError) {
               if ((profileError as any).data) {
                    dispatch(handleError((profileError as any).data.message));
               } else {
                    console.log((profileError as any).error);
                    dispatch(handleError((profileError as any).error));
               }
          }
          if (!data) {
               (async () => {
                    await GetDataAnalytics();
               })();
          }
     }, [isDataError, dataError, dispatch, GetDataAnalytics, data, isProfileError, profileError]);

     return (
          <Layout>
               <div className="flex justify-between items-center">
                    <h6 className="text-3xl font-semibold capitalize">
                         Welcome {profile?.data.name.lastName} {profile?.data.name.firstName}!
                    </h6>
               </div>
               <p className="text-gray-500">Greetings from Infinity Tech Solutions</p>
               {!isDataLoading && (
                    <div className="mt-10 grid grid-cols-1 xl:grid-cols-4 gap-10 lg:grid-cols-4 md:grid-cols-2">
                         <DashboardCard
                              Icon={LuGalleryHorizontal}
                              label="events"
                              path="/events"
                              value={data?.data.event}
                         />
                         <DashboardCard
                              Icon={MdOutlineEmojiEvents}
                              label="programs"
                              path="/gallery"
                              value={data?.data.program}
                         />
                         <DashboardCard
                              Icon={IoReceiptOutline}
                              label="total donations"
                              path="/donations"
                              value={data?.data.donations}
                         />
                         <DashboardCard Icon={PiPenNibLight} label="blogs" path="/blogs" value={data?.data.blogs} />
                    </div>
               )}
               {isDataLoading && (
                    <div>
                         <p>Please wait....</p>
                    </div>
               )}
               <div className="flex-1 px-10">
                    <div className="my-10 flex justify-between items-center relative">
                         <h6 className="text-3xl ">Your Donations</h6>
                         <div className="absolute right-0 z-50">
                              {showCalender ? (
                                   <Calendar
                                        onChange={(e) => {
                                             onChange(e);
                                             setShowCalender(false);
                                        }}
                                        value={value}
                                   />
                              ) : (
                                   <Button onClick={() => setShowCalender(!showCalender)}>Filter</Button>
                              )}
                         </div>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                         <LineChart width={300} height={100} data={LineChartData}>
                              <Line type="monotone" dataKey="amt" stroke="#10b981" strokeWidth={2} />
                              <XAxis name="amt" />
                              <YAxis name="name" />
                              <CartesianGrid strokeDasharray={3} />
                              <Tooltip
                                   content={({ payload }) => {
                                        return (
                                             <div className="bg-white shadow-xl p-3 flex flex-col gap-3">
                                                  <p className="font-semibold">
                                                       Donator - {(payload as any)[0]?.payload?.name}
                                                  </p>
                                                  <p className="text-sm text-gray-500">
                                                       Amount - {(payload as any)[0]?.payload?.amt}
                                                  </p>
                                             </div>
                                        );
                                   }}
                              />
                         </LineChart>
                    </ResponsiveContainer>
               </div>
          </Layout>
     );
};
