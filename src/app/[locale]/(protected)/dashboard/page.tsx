import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome,
            {session?.user?.email}!
          </p>
          <p className="mt-2 text-gray-500">You are now logged in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
