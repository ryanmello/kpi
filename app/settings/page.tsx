import { auth } from "@/auth";

const Settings = async () => {
  const session = await auth();
  return (
    <div>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
};

export default Settings;
