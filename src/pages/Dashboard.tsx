import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Mail, MessageSquare, Briefcase, DollarSign, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { contactAPI, projectsAPI, servicesAPI } from "@/lib/api";
import { formatDistanceToNow } from 'date-fns';
import type { Message, Project, Service } from "@/types";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Dashboard = () => {
  // Fetch data from API with proper typing
  const { data: messages = [] as Message[] } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: () => contactAPI.getAll().then(res => res.data || []),
  });

  const { data: projects = [] as Project[] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll().then(res => res.data || []),
  });

  const { data: services = [] as Service[] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => servicesAPI.getAll().then(res => res.data || []),
  });

  // Process data for charts
  const projectStatusCount = projects.reduce(
    (acc, project) => {
      acc[project.status || 'On Hold'] = (acc[project.status || 'On Hold'] || 0) + 1;
      return acc;
    },
    { 'In Progress': 0, 'Completed': 0, 'On Hold': 0 }
  );

  const projectData = Object.entries(projectStatusCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Generate revenue data (example - replace with actual revenue data from your API)
  const revenueData = Array(6).fill(0).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      name: date.toLocaleString('default', { month: 'short' }),
      revenue: Math.floor(Math.random() * 5000) + 1000, // Random data for demo
    };
  });

  // Recent activity from messages
  const recentActivity = messages
    .slice(0, 5)
    .map((message, index) => ({
      id: message._id || index,
      title: `New message from ${message.name}`,
      description: message.message.substring(0, 60) + (message.message.length > 60 ? '...' : ''),
      time: formatDistanceToNow(new Date(message.createdAt || new Date()), { addSuffix: true }),
      status: 'unread',
    }));
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard 
          title="Total Revenue" 
          value="$24,780" 
          change="+12.5% from last month" 
          icon={<DollarSign className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Active Projects" 
          value={projects.length.toString()} 
          change={`${projectStatusCount['In Progress']} in progress`} 
          icon={<Briefcase className="h-4 w-4" />} 
        />
        <StatsCard 
          title="New Messages" 
          value={messages.length.toString()} 
          change={`${Math.floor(messages.length * 0.2)} from yesterday`} 
          icon={<MessageSquare className="h-4 w-4" />} 
          badge={messages.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {Math.min(9, messages.length)}+ New
            </Badge>
          )}
        />
        <StatsCard 
          title="Total Services" 
          value={services.length.toString()} 
          change={`${Math.floor(services.length * 0.3)} featured`} 
          icon={<DollarSign className="h-4 w-4" />} 
        />
        <StatsCard 
          title="Team Members" 
          value="15" 
          change="+2 this month" 
          icon={<Users className="h-4 w-4" />} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {projectData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                <div className={`p-2 rounded-full mr-4 ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                  activity.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : activity.status === 'in-progress' ? (
                    <Activity className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{activity.title}</h3>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
