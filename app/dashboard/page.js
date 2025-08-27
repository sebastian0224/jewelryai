import { ImageWorkflow } from "@/components/dashboard/ImageWorkflow/ImageWorkflow";
import { WorkflowProvider } from "@/components/dashboard/ImageWorkflow/WorkflowContext";
export default function DashboardHome() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Jewelry Background Changer
      </h1>

      {/* Main workflow component */}
      <WorkflowProvider>
        <ImageWorkflow />
      </WorkflowProvider>
    </div>
  );
}
