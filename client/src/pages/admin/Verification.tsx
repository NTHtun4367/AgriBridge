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
import { useTranslation } from "react-i18next";

function Verification() {
  const { t } = useTranslation();
  const { data } = useGetAllVerificationPendingUsersQuery(undefined);

  return (
    <div className="w-full h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">{t("verification.title")}</h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableCaption className="mm:leading-loose">{t("verification.table_caption")}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  {t("verification.columns.name")}
                </TableHead>
                <TableHead className="text-center">
                  {t("verification.columns.role")}
                </TableHead>
                <TableHead className="text-center">
                  {t("verification.columns.email")}
                </TableHead>
                <TableHead className="text-center">
                  {t("verification.columns.status")}
                </TableHead>
                <TableHead className="text-center">
                  {t("verification.columns.submitted")}
                </TableHead>
                <TableHead className="text-right">
                  {t("verification.columns.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-left font-medium">
                    {user.name}
                  </TableCell>
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
                      {/* Using dynamic key for status localization */}
                      {t(`verification.status.${user.verificationStatus}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(user.createdAt), "dd MMM yy")}
                  </TableCell>
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
