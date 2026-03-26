"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/credenza";
import { Button } from "@/components/ui/button";

import Link from "next/link";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  id: number;
}

export function ConfirmationDialog({ open, setOpen, name, id }: Props) {
  return (
    <>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Please confirm if this is you</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="text-2xl font-bold text-center">{name}</div>
          </CredenzaBody>
          <CredenzaFooter>
            <div className="flex  flex-col w-full gap-2">
              <Link href="scm/home">
                <Button className="w-full">Yes</Button>
              </Link>

              <CredenzaClose asChild>
                <Button variant="secondary">No</Button>
              </CredenzaClose>
            </div>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
