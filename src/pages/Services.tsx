import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { caseStudiesAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Cloud, 
  Code, 
  Smartphone, 
  Database, 
  Shield, 
  BarChart, 
  Cpu,
  ArrowRight 
} from "lucide-react";
import { servicesAPI } from "@/lib/api";

// Icon mapping
const iconMap: Record<string, any> = {
  Sparkles,
  Cloud,
  Code,
  Smartphone,
  Database,
  Shield,
  BarChart,
  Cpu,
};

// Default descriptions and features for services that don't have them in the backend
const defaultDescriptions: Record<string, string> = {
  "AI & Machine Learning":
    "Build and deploy custom machine learning models and AI-powered products — from data pipelines and model training to production-grade inference and monitoring.",
  "Cloud Solutions":
    "Design, migrate and operate secure, scalable cloud environments (AWS/Azure/GCP). We provide architecture, cost optimization and cloud-native engineering.",
  "Web Development":
    "Design and build modern web applications with focus on performance, accessibility and maintainability using React, Next.js, and other modern stacks.",
  "Digital Web Development":
    "Full-stack web development focusing on user-centered design, fast front-ends, and robust back-end APIs to power digital experiences.",
  "Mobile Applications":
    "Native and cross-platform mobile apps with delightful UX, offline support and smooth performance — iOS, Android, React Native and Flutter.",
  "Cloud Infrastructure":
    "Implement resilient cloud infrastructure, IaC (Terraform), CI/CD pipelines, and observability to keep systems reliable and secure.",
  "Digital Transformation":
    "Help organizations modernize processes and systems, adopt cloud and automation, and upskill teams to accelerate business outcomes.",
};

const defaultFeatures: Record<string, string[]> = {
  "AI & Machine Learning": [
    "Custom ML model development",
    "Data engineering & pipelines",
    "NLP & conversational AI",
    "Model deployment & monitoring",
  ],
  "Cloud Solutions": [
    "Cloud strategy & migration",
    "Architecture & cost optimization",
    "DevOps & CI/CD",
    "Security & compliance",
  ],
  "Web Development": [
    "Responsive UI & accessibility",
    "SPA & SSR (React/Next.js)",
    "Headless CMS & e-commerce",
    "Performance optimization",
  ],
  "Digital Web Development": [
    "Design systems & component libraries",
    "API-first backends",
    "Progressive Web Apps",
    "A/B testing & analytics",
  ],
  "Mobile Applications": [
    "Native iOS/Android",
    "Cross-platform (React Native/Flutter)",
    "App performance & offline support",
    "Store submission & maintenance",
  ],
  "Cloud Infrastructure": [
    "Infrastructure as Code (Terraform)",
    "Multi-cloud & hybrid architectures",
    "Observability & runbooks",
    "Disaster recovery planning",
  ],
  "Digital Transformation": [
    "Process automation & RPA",
    "Legacy modernization",
    "Change management",
    "Training & enablement",
  ],
};

// Dialog used by each service card to show details, case studies and links
const ServiceDetailDialog = ({ service, caseStudies }: any) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button size="sm" variant="ghost" className="mt-4">Learn more</Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl mb-4">{service.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <div>
          <h4 className="font-medium mb-2">Key features</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {(service.features || []).map((f: string, i: number) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="pt-4">
          <h4 className="font-medium mb-2">Case studies</h4>
          <ul className="space-y-3">
            {(caseStudies?.[service.title] || []).map((cs: any) => (
              <li key={cs._id || cs.id} className="flex items-start gap-3">
                {cs.logo ? (
                  <img src={cs.logo} alt={cs.title} className="w-10 h-10 object-contain rounded" />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">Logo</div>
                )}
                <div className="flex-1 text-sm">
                  <a href={cs.url || '#'} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">{cs.title}</span>
                  </a>
                  <p className="text-muted-foreground text-sm mt-1">{cs.summary}</p>
                </div>
              </li>
            ))}
            {(caseStudies?.[service.title] || []).length === 0 && (
              <li className="text-sm text-muted-foreground">No case studies available yet. Contact us to learn more.</li>
            )}
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Services = () => {
  // Fetch services from backend
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await servicesAPI.getAll();
      return response.data || [];
    },
  });

  // Map backend services to frontend format
  const services = ((servicesData as any[]) || []).map((service: any) => ({
    icon: iconMap[service.icon] || Code,
    title: service.title,
    description: service.description || defaultDescriptions[service.title] || "High-quality service delivered by experienced engineers.",
    features: service.features || defaultFeatures[service.title] || [
      "Custom solutions",
      "Expert consultation",
      "Ongoing support",
      "Best practices",
    ],
  }));

  // Fetch case-studies from backend
  const { data: caseStudiesData } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: async () => {
      const response = await caseStudiesAPI.getAll();
      return response.data || {};
    },
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive IT solutions designed to accelerate your digital transformation journey 
              and drive business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110 duration-300">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <ServiceDetailDialog service={service} caseStudies={caseStudiesData} />
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center bg-gradient-primary border-0">
            <CardHeader className="space-y-4 py-12">
              <CardTitle className="text-3xl md:text-4xl text-primary-foreground">
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg text-primary-foreground/90">
                Let's discuss how our services can help transform your business and achieve your goals.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/contact">
                  <Button size="lg" variant="secondary">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Services;
