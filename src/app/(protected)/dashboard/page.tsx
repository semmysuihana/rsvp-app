
import PageContainer from "~/component/pageContainer";
import CardContainer from "~/component/cardContainer";
import CardDesign from "~/component/cardDesign";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <PageContainer>
      {/* Gradient Welcome Section */}
      <div className="w-full p-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm opacity-90">
            Here is whats happening with your events
          </p>
        </div>

        <Link
          href="/events/create"
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          + New Event
        </Link>
      </div>

      {/* Cards */}
      <CardContainer cols={4}>
        <CardDesign nameCard="Total Events" value={"4"} />
        <CardDesign nameCard="Total Guests" value={"402"} />
        <CardDesign nameCard="Confirmed RSVPs" value={"3"} />
        <CardDesign nameCard="Pending RSVPs" value={"77%"} />
      </CardContainer>

      {/* Recent Events Section */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Events</h2>
          <Link
            href="/events"
            className="text-indigo-600 hover:underline text-sm"
          >
            View all events
          </Link>
        </div>

        {/* Empty State */}
        <div className="w-full flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <span className="text-gray-500 text-2xl">📅</span>
          </div>
          <p className="mt-4 font-medium">No Events Found</p>
          <p className="text-sm text-gray-500">
            You havent created any events yet. Start by creating your first event!
          </p>
          <Link
            href="/events/create"
            className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            + Create Event
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
