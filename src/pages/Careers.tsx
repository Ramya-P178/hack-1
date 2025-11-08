import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Briefcase, ArrowRight, Send } from "lucide-react";
import { careersAPI } from "@/lib/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Careers = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    portfolio: "",
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resume CTA form state
  const [resumeForm, setResumeForm] = useState({
    name: "",
    email: "",
    message: "",
    resume: null as File | null,
  });
  const [isResumeSubmitting, setIsResumeSubmitting] = useState(false);

  // Fetch careers from backend
  const { data: careersData, isLoading } = useQuery({
    queryKey: ['careers'],
    queryFn: async () => {
      const response = await careersAPI.getAll();
      return response.data || [];
    },
  });

  interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description: string;
    skills: string[];
  }

  const openings = (careersData || []) as Job[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.coverLetter) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real application, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        portfolio: "",
        resume: null
      });
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setFormData({
        ...formData,
        resume: file
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handlers for the CTA resume upload form
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const file = e.target.files?.[0] || null;
      setResumeForm({ ...resumeForm, resume: file });
    } else {
      setResumeForm({ ...resumeForm, [e.target.name]: e.target.value } as any);
    }
  };

  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeForm.name || !resumeForm.email || !resumeForm.resume) {
      toast({
        title: 'Error',
        description: 'Please provide name, email and attach your resume.',
        variant: 'destructive',
      });
      return;
    }

    setIsResumeSubmitting(true);
    try {
      // Convert file to base64
      const file = resumeForm.resume as File;
      const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // result is like data:application/pdf;base64,XXXXX
          const parts = result.split(',');
          resolve(parts[1]);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(f);
      });

      const base64 = await fileToBase64(file);

      // Send to backend via JSON (backend will decode and save)
      const payload = {
        name: resumeForm.name,
        email: resumeForm.email,
        message: resumeForm.message || '',
        filename: file.name,
        fileType: file.type,
        fileDataBase64: base64,
      };

      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Upload failed');

      toast({ title: 'Resume Sent!', description: "Thanks — we've received your resume and will be in touch." });
      setResumeForm({ name: '', email: '', message: '', resume: null });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to upload resume.', variant: 'destructive' });
    } finally {
      setIsResumeSubmitting(false);
    }
  };

  const benefits = [
    "Competitive salary and equity",
    "Health, dental, and vision insurance",
    "Flexible work arrangements",
    "Professional development budget",
    "Annual company retreats",
    "Latest tech equipment",
    "Unlimited PTO",
    "Parental leave",
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground">
              Build the future of technology with talented people who share your passion for innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Mastersolis?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're not just building software—we're shaping the future. Join a team that values innovation, 
              collaboration, and continuous growth.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-foreground">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-muted-foreground">
              Find your next opportunity and make an impact.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading job openings...</p>
              </div>
            ) : (
              openings.map((job, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-base mb-4">{job.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="self-start md:self-auto" onClick={() => setSelectedJob(job)}>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to apply for this position. We'll review your application and get back to you soon.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                            <Input
                              id="portfolio"
                              name="portfolio"
                              type="url"
                              value={formData.portfolio}
                              onChange={handleChange}
                              placeholder="https://"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="resume">Resume (PDF) *</Label>
                            <Input
                              id="resume"
                              name="resume"
                              type="file"
                              accept=".pdf"
                              onChange={handleChange}
                              required
                              className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Max file size: 5MB. PDF format only.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter *</Label>
                            <Textarea
                              id="coverLetter"
                              name="coverLetter"
                              value={formData.coverLetter}
                              onChange={handleChange}
                              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                              rows={6}
                              required
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                            <Send className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      {job.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {job.type}
                    </div>
                    <div className="flex items-center font-medium">
                      Experience: {job.experience}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center bg-gradient-primary border-0">
            <CardHeader className="space-y-4 py-12">
              <CardTitle className="text-3xl md:text-4xl text-primary-foreground">
                Don't See Your Role?
              </CardTitle>
              <CardDescription className="text-lg text-primary-foreground/90">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </CardDescription>
              <div className="pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="secondary" onClick={() => { /* open dialog */ }}>
                      Send Your Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Send Your Resume</DialogTitle>
                      <DialogDescription>
                        Upload your resume and a short message — we'll keep it on file for future roles.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleResumeSubmit} className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="cta-name">Name *</Label>
                        <Input id="cta-name" name="name" value={resumeForm.name} onChange={handleResumeChange} placeholder="Your full name" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta-email">Email *</Label>
                        <Input id="cta-email" name="email" type="email" value={resumeForm.email} onChange={handleResumeChange} placeholder="you@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta-resume">Resume (PDF) *</Label>
                        <Input id="cta-resume" name="resume" type="file" accept=".pdf" onChange={handleResumeChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cta-message">Message</Label>
                        <Textarea id="cta-message" name="message" value={resumeForm.message} onChange={handleResumeChange} placeholder="Optional note" rows={4} />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" size="lg" className="w-full" disabled={isResumeSubmitting}>
                          {isResumeSubmitting ? 'Sending...' : 'Send Resume'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Careers;
