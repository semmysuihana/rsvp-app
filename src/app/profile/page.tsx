"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "../component/loading";
import Alert from "../component/alert";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "~/app/utils/actionProfile";
import CardContainer from "~/component/cardContainer";
import CardDesign from "~/component/cardDesign";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import ModalDesign from "~/component/modalDesign";
import { useState } from "react";
export default function ProfilePage() {
  const { profile, loading, alert, showAlert, setShowAlert, handleGetProfile, handleUpdate } = useProfile();
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const fieldsPassword: Field[] = [
    {
      type: "password",
      name: "newPassword",
      label: "New Password",
    },
    {
      type: "password",
      name: "confirmPassword",
      label: "Confirm Password",
    },
    {
      type: "password",
      name: "oldPassword",
      label: "Old Password",
    }
  ]
  const fields: Field[] = [
    {
      type: "text",
      name: "name",
      label: "Name",
      value: profile?.name
    },
    {
      type: "text",
      name: "username",
      label: "Username",
      value: profile?.username
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      value: profile?.email
    },
    {
      type: "tel",
      name: "phone",
      label: "Phone",
      value: profile?.phone
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      options: ["MALE", "FEMALE"],
      value: profile?.gender
    },
    
    {
      type: "text",
      name: "idCardNumber",
      label: "ID Card Number",
      value: profile?.idCardNumber
    }
  ]
  useEffect(() => {
    if (session?.user.id) {
      void handleGetProfile(session.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);
  
  const onSubmit = async (formData: FormData) =>{
   await handleUpdate(formData);
  };
  return (
    <>
      {modalOpen && (
        <ModalDesign
          title="Update Password"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <FormSetting
            fields={fieldsPassword}
            submitText="Update"
            onSubmit={onSubmit}
          />
          <button
            className="mt-4 px-4 py-2 w-full bg-gray-500 rounded-md hover:bg-red-400 cursor-pointer"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </ModalDesign>
      )}
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      {/* Alert */}
      {showAlert && (
        <div className="mb-4">
          <Alert alert={alert} setShowAlert={setShowAlert} />
        </div>
      )}

      <PageContainer>
        <PageHeader title="Profile" subtitle="Your account information" />

        <div className="w-full max-w-full overflow-x-auto">
  {profile && (
    <div className="bg-gray-900 border border-gray-700 shadow-xl rounded-2xl p-8 space-y-10">

      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        
        {/* Avatar */}
       <div className="w-28 h-28 flex items-center justify-center rounded-full bg-indigo-600 text-white text-4xl font-bold shadow-lg">
  {profile?.name?.charAt(0).toUpperCase()}
</div>


        {/* Basic Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-semibold text-white">{profile.name}</h2>
          <p className="text-gray-300">{profile.email}</p>
          <p className="text-gray-500 text-sm">Member ID: {profile.id}</p>

          {/* Badge */}
          <span
            className={`inline-block px-4 py-1 mt-3 rounded-full text-sm font-semibold ${
              profile.subscriptionPlan === "PRO"
                ? "bg-purple-600/30 text-purple-300"
                : profile.subscriptionPlan === "BASIC"
                ? "bg-blue-600/30 text-blue-300"
                : "bg-gray-600/30 text-gray-300"
            }`}
          >
            {profile.subscriptionPlan} PLAN
          </span>
        </div>

      </div>

      <div className="border-t border-gray-700 w-full"></div>

      {/* Detail Grid */}
      <CardContainer cols={1}>
        <CardDesign nameCard="Phone" value={profile.phone} />
        <CardDesign nameCard="ID Card Number" value={profile.idCardNumber} />
        <CardDesign nameCard="Birth Date" value={new Date(profile.birthDate).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" })} />
        <CardDesign nameCard="Gender" value={profile.gender} />
      </CardContainer>

          <div className="border-t border-gray-700 w-full"></div>
         
    <FormSetting fields={fields} submitText="Update" onSubmit={onSubmit} cols={2} modal={true} />

    
      <div className="border-t border-gray-700 w-full"></div>
      <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-red-600 cursor-pointer" onClick={() => setModalOpen(true)}>Change Password</button>
    </div>
    
  )}

  {!profile && !loading && (
    <p className="text-center text-gray-400">No profile data available</p>
  )}

        </div>
      </PageContainer>
    </>
  );
}
