"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ 
  disabled,
  date,
  setDate,
}: { 
  disabled?: boolean;
  date?: Date;
  setDate?: (date: Date | undefined) => void;
}) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date)

  const selectedDate = date !== undefined ? date : internalDate
  const handleSelect = setDate ? setDate : setInternalDate

  return (
    <Popover>
      <PopoverTrigger render={<Button disabled={disabled} variant={"outline"} data-empty={!selectedDate} className="flex-1 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">{selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}<ChevronDownIcon data-icon="inline-end" /></Button>} />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
