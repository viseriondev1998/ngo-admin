import React, { useEffect, useState } from "react";
import { Layout } from "../../layout";
import { AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useManualEntryForDonationMutation } from "../../redux/api";
import { handleError } from "../../redux/app";
import { useAppDispatch } from "../../redux";
import { IDonationProps } from "../../interface";
import { toast } from "react-toastify";
import { Button, InputField } from "../../component";

export const ManualDonationPage = () => {
     const [
          NewDonation,
          {
               isError: isDonationError,
               error: donationError,
               isLoading: isDonationLoading,
               isSuccess: isDonationSuccess,
               data: donationApi,
          },
     ] = useManualEntryForDonationMutation();
     const navigate = useNavigate();
     const dispatch = useAppDispatch();
     const [donationInput, setDonationInput] = useState<IDonationProps>({} as IDonationProps);
     const [donationMode, setDonationMode] = useState<string>();

     useEffect(() => {
          if (isDonationError) {
               console.log(donationError);
               if ((donationError as any).data) {
                    dispatch(handleError((donationError as any).data.message));
               } else {
                    console.log(donationError as any);
                    dispatch(handleError((donationError as any).error));
               }
          }
          if (isDonationSuccess) {
               toast.success(donationApi?.data);
               navigate("/donations", { replace: true });
          }
     }, [isDonationError, donationError, dispatch, isDonationSuccess, donationApi?.data, navigate]);

     const handleSubmit = async (e: any) => {
          e.preventDefault();
          const { amount, email, custName, mobile } = donationInput;
          console.log(donationInput);

          if (!amount || !email || !mobile || !custName) {
               return toast.error("fill form properly");
          } else {
               await NewDonation({
                    amount: donationInput.amount,
                    email: donationInput.email,
                    custName: donationInput.custName,
                    mobile: donationInput.mobile,
                    paymentToken: donationMode as string,
                    referenceId: "none",
                    status: "SUCCESS",
               });
          }
     };

     return (
          <Layout>
               <div className="w-[80%] mx-auto">
                    <div className="flex items-center gap-3">
                         <button type="button" onClick={() => navigate("/events", { replace: true })}>
                              <AiOutlineLeft size={26} />
                         </button>
                         <h6 className="text-2xl capitalize">Create manual receipt for donations</h6>
                    </div>
                    <p className="text-gray-500">
                         This is manual entry for your donations like client donate you by cash, cheque or other payment
                         methods instead of online.
                    </p>
                    <form className="mt-10" onSubmit={handleSubmit}>
                         <div className="flex flex-col gap-10">
                              <div>
                                   <InputField
                                        type="number"
                                        label="enter amount"
                                        value={donationInput.amount}
                                        onChange={(e) =>
                                             setDonationInput({
                                                  ...donationInput,
                                                  amount: parseInt(e.target.value),
                                             })
                                        }
                                   />
                              </div>

                              <InputField
                                   type="text"
                                   label="enter customer name"
                                   value={donationInput.custName}
                                   onChange={(e) =>
                                        setDonationInput({
                                             ...donationInput,
                                             custName: e.target.value,
                                        })
                                   }
                              />
                              <div className="flex items-center gap-5">
                                   <div className="flex-1">
                                        <InputField
                                             type="email"
                                             label="enter customer email address"
                                             value={donationInput.email}
                                             onChange={(e) =>
                                                  setDonationInput({
                                                       ...donationInput,
                                                       email: e.target.value,
                                                  })
                                             }
                                        />
                                   </div>
                                   <div className="flex-1">
                                        <InputField
                                             type="text"
                                             label="enter customer mobile number"
                                             value={donationInput.mobile}
                                             onChange={(e) =>
                                                  setDonationInput({
                                                       ...donationInput,
                                                       mobile: e.target.value,
                                                  })
                                             }
                                        />
                                   </div>
                              </div>
                              <div className="flex-1">
                                   <select
                                        name=""
                                        id=""
                                        value={donationMode}
                                        onChange={(e) => setDonationMode(e.target.value)}
                                   >
                                        <option value="" selected disabled>
                                             None
                                        </option>
                                        <option value="CASH">Cash</option>
                                        <option value="CHEQUE">Cheque</option>
                                        <option value="OTHER">Other</option>
                                   </select>
                              </div>
                              <div className="flex justify-end items-center">
                                   <Button loading={isDonationLoading} outlined>
                                        Save
                                   </Button>
                              </div>
                         </div>
                    </form>
               </div>
          </Layout>
     );
};
