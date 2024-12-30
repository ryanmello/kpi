import { auth, signOut } from "@/auth";
import { getUserByEmail } from "@/data/user";
import DepartmentForm from "./components/DepartmentForm";
import PositionForm from "./components/PositionForm";
import UpdateUserForm from "./components/UpdateUserForm";
import { getUsers } from "../actions/getUsers";
import { getDepartments } from "../actions/getDepartments";
import { getPositions } from "../actions/getPositions";
import { User } from "@prisma/client";

const Settings = async () => {
  const session = await auth();
  const user = (await getUserByEmail(session?.user?.email)) as User;
  const users = await getUsers();
  const departments = await getDepartments();
  const positions = await getPositions();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="gap-4">
        <div className="space-y-4">
          <ItemList title="Users" items={users} />
          <ItemList title="Departments" items={departments} />
          <ItemList title="Positions" items={positions} />

          <UpdateUserForm
            user={user}
            users={users}
            departments={departments}
            positions={positions}
          />

          <DepartmentForm />
          <PositionForm />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

const ItemList = ({ title, items }: { title: string; items: any[] }) => (
  <div className="shadow rounded-lg">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-sm">
          {item.name || item.email || JSON.stringify(item)}
        </li>
      ))}
    </ul>
  </div>
);

const SignOutButton = () => (
  <form
    action={async () => {
      "use server";
      await signOut();
    }}
  >
    <button
      type="submit"
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Sign out
    </button>
  </form>
);

export default Settings;
