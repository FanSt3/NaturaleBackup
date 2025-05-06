import ActivityCard from "@/components/activities/ActivityCard";
import { prisma } from "@/lib/db";

async function getActivities() {
  try {
    const activities = await prisma.activity.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    return activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Naše aktivnosti</h1>
        <p className="text-xl text-gray-600">
          Pratite najnovije događaje, radionice, predavanja i druge aktivnosti Naturale projekta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              title={activity.title}
              content={activity.content}
              image={activity.image || undefined}
              date={activity.createdAt}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Nema objavljenih aktivnosti</h3>
            <p className="text-gray-500">Uskoro ćemo dodati više sadržaja!</p>
          </div>
        )}
      </div>
    </div>
  );
} 