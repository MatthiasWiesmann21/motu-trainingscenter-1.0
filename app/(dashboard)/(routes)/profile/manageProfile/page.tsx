import { RedirectToUserProfile } from "@clerk/nextjs";

const manageProfile = () => {
    return ( 
        <RedirectToUserProfile />
     );
}
 
export default manageProfile;