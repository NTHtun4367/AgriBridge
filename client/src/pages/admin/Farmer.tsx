// import UserStatusDropDown from "@/components/admin/UserStatusDropDown";
import UserStatusDropDown from "@/components/admin/UserStatusDropDown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllFarmersQuery } from "@/store/slices/userApi";

function Farmer() {
  const { data } = useGetAllFarmersQuery(undefined);

  console.log(data);

  return (
    <div className="bg-secondary w-full h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Farmers</h2>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of your all farmers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">User Id</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    INV - {user._id}
                  </TableCell>
                  <TableCell className="text-center">{user.name}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        user.status === "active" ? "bg-primary" : "bg-red-600"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <UserStatusDropDown
                    // userId={user._id}
                    // userStatus={user.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>  
        </CardContent>
      </Card>
    </div>
  );
}

export default Farmer;
