import { ImageWorkflow } from "@/components/dashboard/ImageWorkflow/ImageWorkflow";
import { WorkflowProvider } from "@/components/dashboard/ImageWorkflow/WorkflowContext";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
          Jewelry Background Changer
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto text-pretty">
          Transform your jewelry images with professional backgrounds using
          artificial intelligence
        </p>
      </div>

      {/* Main workflow component */}
      <WorkflowProvider>
        <ImageWorkflow />
      </WorkflowProvider>
    </div>
  );
}
