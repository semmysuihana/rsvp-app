export default function CardDesign({
  nameCard,
  value,
}: {
  nameCard: string;
  value: string;
}) {
  return (
    <div className="
      bg-white 
      dark:bg-gray-800 
      p-5 rounded-xl shadow-md 
      border border-gray-200 
      dark:border-gray-700 
      hover:shadow-lg transition
    ">
      <h2 className="text-gray-700 dark:text-gray-300 font-semibold">
        {nameCard}
      </h2>
      <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
    </div>
  );
}
