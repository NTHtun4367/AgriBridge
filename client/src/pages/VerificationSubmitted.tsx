import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/store";
import { BadgeCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

function VerificationSubmitted() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="max-w-xl mx-auto my-16">
      <Card>
        <CardContent>
          <div className="text-center p-2">
            <div className="flex justify-center mb-4">
              <BadgeCheck className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-xl font-semibold">Verification Submitted</h1>

            <p className="mt-3 text-gray-600">
              Thank you for registering with{" "}
              <b className="text-primary">AgriBridge</b>.
              <br />
              Your information has been successfully submitted.
            </p>

            <p className="mt-3 text-gray-600 text-sm">
              Our team will review your details within <b>24-48 hours</b>.
            </p>

            <div className="mt-6 p-4 bg-secondary rounded">
              <p className="text-sm">
                <b>Current Status:</b>{" "}
                <span className="text-orange-600 capitalize">
                  {user?.verificationStatus || "pending"}
                </span>
              </p>
            </div>

            <div className="mt-6 text-left text-sm text-gray-600">
              <p className="font-semibold">What you can do now:</p>
              <ul className="list-disc ml-5">
                <li>View market prices</li>
                <li>Complete your profile</li>
              </ul>

              <p className="font-semibold mt-3">What you cannot do yet:</p>
              <ul className="list-disc ml-5">
                <li>Set prices</li>
                <li>Trade or transact</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/dashboard-merchant"
                className="bg-primary text-white py-2 rounded text-center"
              >
                Go to Dashboard
              </Link>

              <Link to="/logout" className="text-gray-500 text-sm text-center">
                Logout
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerificationSubmitted;
