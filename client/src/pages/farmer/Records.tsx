import ActivityTitle from "@/components/farmer/ActivityTitle";
import { useGetAllEntriesQuery } from "@/store/slices/farmerApi";

function Records() {
  const { data: entries } = useGetAllEntriesQuery();

  return (
    <div className="w-full h-screen p-4 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6">Farm Records</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {entries && entries.length === 0 ? (
          <div>No recent entries.</div>
        ) : (
          entries?.map((en) => (
            <div
              className="bg-white rounded-2xl border border-primary/15"
              key={en._id}
            >
              <ActivityTitle
                id={en._id}
                title={en.category}
                cat={en.type}
                amount={en.value}
                type={en.type}
                date={en.createdAt}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Records;
