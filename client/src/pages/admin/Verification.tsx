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
import { format } from "date-fns";
import { useGetAllVerificationPendingUsersQuery } from "@/store/slices/adminApi";
import VerificationDetails from "@/components/admin/VerificationDetails";

function Verification() {
  const { data } = useGetAllVerificationPendingUsersQuery(undefined);

  return (
    <div className="bw-full h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Verification</h2>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>
              A list of your all verification pending users.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">
                  Verification Status
                </TableHead>
                <TableHead className="text-center">Submitted At</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-center">{user.name}</TableCell>
                  <TableCell className="text-center capitalize">
                    <Badge variant={"outline"} className="bg-white">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        user.verificationStatus === "verified"
                          ? "bg-primary"
                          : "bg-amber-500"
                      }
                    >
                      {user.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableHead className="text-center">
                    {format(new Date(user.createdAt), "dd MMM yy")}
                  </TableHead>
                  <TableCell className="flex items-center justify-end">
                    <VerificationDetails user={user} />
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

export default Verification;
