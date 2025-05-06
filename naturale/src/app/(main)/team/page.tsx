import { prisma } from "@/lib/db";
import TeamMemberCard from "@/components/team/TeamMemberCard";

async function getTeamMembers() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return []; // Return empty array on error
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Naš tim</h1>
        <p className="text-xl text-gray-600">
          Upoznajte entuzijaste koji stoje iza Naturale projekta i posvećeni su približavanju nauke mladima kroz inovativne pristupe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              position={member.position}
              image={member.image}
              description={member.description}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            Trenutno nema članova tima za prikaz.
          </div>
        )}
      </div>
    </div>
  );
} 