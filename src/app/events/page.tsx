"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import { useEvent } from "../utils/actionEvent";
import Loading from "../component/loading";
import Alert from "../component/alert";
import CardList from "~/component/cardList";
import { useEffect } from "react";
export default function Event() {
  const { events, loading, alert, showAlert, handleDelete, refetch, setShowAlert } = useEvent();
  useEffect(() => {
  void refetch();
}, []);

  return (
    <>
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
      
      {/* Title */}
      <PageHeader title="Events" subtitle="Overview & quick stats" />
                {/* Scroll wrapper: full width but limit with max-w-full so body tidak melebar */}
<div className="w-full max-w-full overflow-x-auto">
  <CardList data={events} link="/events" onDelete={handleDelete} />
</div>

    </PageContainer>
    </>
  );
}
