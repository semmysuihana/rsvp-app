import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import CardContainer from "~/component/cardContainer";
import CardDesign from "~/component/cardDesign";
export default async function Dashboard() {
  return (
    <PageContainer>
      {/* Title */}
      <PageHeader title="Dashboard" subtitle="Overview & quick stats" />

      {/* Cards Container */}
      <CardContainer>

        {/* Card  */}
        <CardDesign nameCard="Total event" value={"24"} />
        <CardDesign nameCard="Total RSVP" value={"24"} />
        <CardDesign nameCard="Total Guest" value={"24"} />
        <CardDesign nameCard="Subscription" value={"FREE"} />
      </CardContainer>
    </PageContainer>
  );
}
