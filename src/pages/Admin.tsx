import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactAPI } from "@/lib/api";
import { Mail, Phone, Building, MessageSquare, Calendar } from "lucide-react";

const Admin = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await contactAPI.getAll();
      return response.data || [];
    },
  });

  const messages = data || [];

  return (
    <div className="min-h-screen pt-16">
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Contact Messages
            </h1>
            <p className="text-lg text-muted-foreground">
              View all messages submitted through the contact form
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">No messages yet.</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Messages submitted through the contact form will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Total Messages: <Badge variant="secondary">{messages.length}</Badge>
                </h2>
                <button
                  onClick={() => refetch()}
                  className="text-sm text-primary hover:underline"
                >
                  Refresh
                </button>
              </div>

              {messages.map((message: any) => (
                <Card key={message._id || message.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{message.name}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-primary" />
                              {message.phone}
                            </div>
                          )}
                          {message.company && (
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-primary" />
                              {message.company}
                            </div>
                          )}
                          {message.submitted_at && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-primary" />
                              {new Date(message.submitted_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                        <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;

