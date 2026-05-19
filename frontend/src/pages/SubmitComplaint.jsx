// pages/SubmitComplaint.jsx (mapped to /submit route in App.jsx)
import ComplaintForm from '../components/ComplaintForm';

const SubmitComplaint = () => (
  <div className="max-w-2xl mx-auto animate-fade-in">
    <div className="mb-6">
      <h1 className="font-display font-bold text-2xl text-gray-900">Submit a Complaint</h1>
      <p className="text-gray-500 text-sm mt-1">
        Fill in the details below. Our AI will automatically analyze urgency and route it to the right department.
      </p>
    </div>
    <div className="card p-6">
      <ComplaintForm />
    </div>
  </div>
);

export default SubmitComplaint;
