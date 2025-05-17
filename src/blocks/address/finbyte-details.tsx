import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { platform_user_details } from "@/utils/api/interfaces";
import { capitalize_first_letter } from "@/utils/string-tools";
import { FC } from "react";

interface custom_props {
  finbyte_details: platform_user_details;
}

const AddressFinbyteDetails: FC <custom_props> = ({
  finbyte_details
}) => {

  const details = [
    { title: 'Account Type', data: capitalize_first_letter(finbyte_details?.type??'') },
    { title: 'Username', data: finbyte_details?.ada_handle ?? 'Not Found' },
    { title: 'Finbyte Kudos', data: finbyte_details?.total_kudos },
  ]

  return (
    <Card className="dark:border-neutral-800 relative w-full">
      <CardHeader>
        <Label>Finbyte Details</Label>
      </CardHeader>
      <hr className="dark:border-neutral-800"/>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-1 w-full">
          {details.map((item, index) => (
            <div key={index} className="flex w-full justify-between gap-2 items-center">
              <h1 className="font-semibold text-sm opacity-80">
                {item.title}
              </h1>

              <Badge variant='outline' className="text-sm">
                {item.data}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>

      <BorderBeam duration={20}/>
    </Card>
  )
}

export default AddressFinbyteDetails;