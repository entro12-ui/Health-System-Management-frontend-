// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login';
import Dashboard from './pages/admin/dashboard';
import Displaying from './check';
import RegisterDoc from './pages/admin/registerdoctors';
import DocDashboard from './pages/doctors/docdashboard';
import ClerkDashboard from './pages/clerk/clerkdash';
import Layoutt from './layouts/layout';
import Layoutts from './layouts/layoutts';
import ClerkLayoutt from './layouts/clerkLayout';
import PrivateRoute from './privacy/privateroute'; // import your private route
import RegisterPatients from './pages/clerk/registerpatients';
import DoctorsList from './pages/admin/viewdoctors';
import ViewPatient from './pages/clerk/viewpatient';
import RegisterClerk from './pages/admin/registerclerk';
import RegisterTriage from './pages/admin/registertriage';
import TriageLayout from './layouts/triage';
import TriageDashboard from './pages/triage/triagedash';
import AssignPatient from './pages/triage/viewpatient';
import DoctorNotifications from './pages/doctors/notification';
import PatientHistoryForm from './pages/doctors/patienthistory';
import RegisterLaboratorist from './pages/admin/registerlaboratorist';
import LaboratoryLayout from './layouts/laboratoristlayout';
import LabDashboard from './pages/laboratorist/labdash';
import ViewLabRequests from './pages/laboratorist/labreport';
import DoctorLabNotifications from './pages/doctors/report';
import PatientData from './pages/doctors/patientsdata';
import PharmaLayoutt from './layouts/pharmalayout';
import PharmaDash from './pages/pharmacist/phadash';
import GiveMedics from './pages/pharmacist/vieworders';
import RegisterPharma from './pages/admin/registerpharma';
import ViewAndAssign from './pages/clerk/viewandassign';
import DocAccount from './pages/admin/doctoraccount';
import EyeDoctor from './pages/doctors/eye';
import BrainDoctor from './pages/doctors/brain';
import SkinDoctor from './pages/doctors/skin';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Displaying />} />
        

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/admin' element={<Layoutt />}>
            <Route path='dash' element={<Dashboard />} />
            <Route path='reg' element={<RegisterDoc />} />
            <Route path='doclist' element={<DoctorsList />} />
            <Route path='clerklist' element={<RegisterClerk />} />
            <Route path='tiragelist' element={<RegisterTriage />} />
            <Route path='laboratorylist' element={<RegisterLaboratorist />} />
            <Route path='pharmalist' element={<RegisterPharma />} />
            <Route path='docacc' element={<DocAccount />} />
          </Route>
           
          <Route path='/clerk' element={<ClerkLayoutt />}>
            <Route path='dash' element={<ClerkDashboard />} />
            <Route path='patient' element={<RegisterPatients />} />
            <Route path='patientlist' element={<ViewPatient />} />
            <Route path='viewandassign' element={<ViewAndAssign />} />
            

          </Route>
          <Route path='/triage' element={<TriageLayout />}>
            <Route path='triagedash' element={<TriageDashboard />} />
            <Route path='triageview' element={<AssignPatient />} />
          </Route>
          <Route path='/laboratorist' element={<LaboratoryLayout />}>
            <Route path='labdash' element={<LabDashboard />} />
            <Route path='report' element={<ViewLabRequests />} />
          </Route>
          <Route path='/pharmacist' element={<PharmaLayoutt />}>
            <Route path='pharmadash' element={<PharmaDash />} />
            <Route path='viewreq' element={<GiveMedics />} />
          </Route>

          <Route path='/doctors' element={<Layoutts />}>
            <Route path='docdash' element={<DocDashboard />} />
            <Route path='notification' element={<DoctorNotifications/>} />
            <Route path='viewpatienthistory' element={<PatientHistoryForm/>} />
            <Route path='labreport' element={<DoctorLabNotifications/>} />
            <Route path='history' element={<PatientData/>} />
            <Route path="eye" element={<EyeDoctor />} />
            <Route path='brain' element={<BrainDoctor />} />
            <Route path='skin' element={<SkinDoctor />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
