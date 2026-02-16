import { useMemo } from "react";
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
import { localizeData, toMyanmarNumerals } from "@/utils/translator";

function Verification() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "mm") || "en";

  const { data: rawData = [] } =
    useGetAllVerificationPendingUsersQuery(undefined);

  // Localize the data (names, etc.) based on current language
  const localizedData = useMemo(() => {
    return localizeData(rawData, currentLang);
  }, [rawData, currentLang]);

  // Helper to localize dates and numbers
  const formatUI = (val: string | number) => {
    return currentLang === "mm" ? toMyanmarNumerals(val) : val.toString();
  };

  const formatDate = (dateString: string) => {
    const formattedDate = format(new Date(dateString), "dd MMM yy");
    return currentLang === "mm"
      ? toMyanmarNumerals(formattedDate)
      : formattedDate;
  };

  return (
    <div className="w-full h-screen p-4">
      {/* Ensure t() returns a string to avoid React child errors */}
      <h2 className="text-2xl font-bold mb-6 mm:leading-loose">
        {String(t("verification.title"))}
      </h2>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableCaption className="mm:leading-loose">
              {/* Fix for total found count to avoid TypeScript 'count: string' error */}
              {String(t("verification.table_caption")).replace(/\d+/g, (m) =>
                formatUI(m),
              )}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left font-bold">
                  {String(t("verification.columns.name"))}
                </TableHead>
                <TableHead className="text-center font-bold">
                  {String(t("verification.columns.role"))}
                </TableHead>
                <TableHead className="text-center font-bold">
                  {String(t("verification.columns.email"))}
                </TableHead>
                <TableHead className="text-center font-bold">
                  {String(t("verification.columns.status"))}
                </TableHead>
                <TableHead className="text-center font-bold">
                  {String(t("verification.columns.submitted"))}
                </TableHead>
                <TableHead className="text-right font-bold">
                  {String(t("verification.columns.action"))}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localizedData && localizedData.length > 0 ? (
                localizedData.map((user: any) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-left font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-center capitalize">
                      <Badge variant={"outline"} className="bg-white border-2">
                        {String(
                          t(`roles.${user.role}`, { defaultValue: user.role }),
                        )}
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
                        {String(
                          t(`verification.status.${user.verificationStatus}`, {
                            defaultValue: user.verificationStatus,
                          }),
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="flex items-center justify-end">
                      <VerificationDetails user={user} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {String(
                      t("common.no_data", {
                        defaultValue: "No pending verifications",
                      }),
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Verification;
