"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "~/app/utils/actionProfile";
import CardContainer from "~/component/cardContainer";
import CardDesign from "~/component/cardDesign";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import ModalDesign from "~/component/modalDesign";
import { useState } from "react";
import SubcriptionPlan from "~/component/subcriptionPlan";
export default function ProfilePage() {
  const { profile, loading, alert, showAlert, setShowAlert, handleGetProfile, handleUpdate, handleUpdatePassword } = useProfile();
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
      void handleGetProfile();
    }
  }, [session?.user.id, handleGetProfile]);
  
  const onSubmit = async (formData: FormData) =>{
   await handleUpdate(formData);
  };

  const onSubmitPassword = async (formData: FormData) => {
    await handleUpdatePassword(formData);
    setModalOpen(false);
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
            onSubmit={onSubmitPassword}
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
  <PageHeader title="Profile" subtitle="Manage your account & preferences" />

  {profile && (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Top Profile Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-5xl font-bold shadow-lg">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{profile.email}</p>
          <p className="text-gray-500 text-sm">Member ID: {profile.id}</p>

          {/* Badge Subscription */}
          <span
            className={`inline-block px-4 py-1 mt-4 rounded-full text-sm font-semibold tracking-wide
            ${
              profile.subscriptionPlan === "PRO"
                ? "bg-purple-600/30 text-purple-700 dark:text-purple-300"
                : profile.subscriptionPlan === "BASIC"
                ? "bg-blue-600/30 text-blue-700 dark:text-blue-300"
                : "bg-gray-600/20 text-gray-600 dark:bg-gray-600/30 dark:text-gray-300"
            }`}
          >
            {profile.subscriptionPlan ?? "NO PLAN"}
          </span>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-8">
        <SubcriptionPlan />
      </div>

      {/* Information Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>

        <CardContainer cols={2}>
          <CardDesign nameCard="Phone" value={profile.phone} />
          <CardDesign nameCard="ID Card Number" value={profile.idCardNumber} />
          <CardDesign
            nameCard="Birth Date"
            value={new Date(profile.birthDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <CardDesign nameCard="Gender" value={profile.gender} />
        </CardContainer>
      </div>

      {/* Update Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h3>

        <FormSetting fields={fields} submitText="Update" onSubmit={onSubmit} cols={2} modal={true} />

        <button
          onClick={() => setModalOpen(true)}
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white w-full sm:w-auto"
        >
          Change Password
        </button>
      </div>
    </div>
  )}
</PageContainer>


    </>
  );
}
