"use client";

import { useState } from "react";
import { EditIcon } from "lucide-react";
import { Button } from "./ui/button";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { transaction } from "@prisma/client";

interface EditTransactionButtonProps {
  transaction: transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <EditIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{ ...transaction, amount: Number(transaction.amount) }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
