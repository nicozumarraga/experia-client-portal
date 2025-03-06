import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Filter, CalendarIcon, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FilterPopoverProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  resetFilters: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dateFilter,
  setDateFilter,
  showFilters,
  setShowFilters,
  resetFilters,
  dateRange,
  setDateRange
}) => {
  // Count active filters (exclude ones set to 'all')
  const activeFilterCount = [
    statusFilter !== 'all' ? 1 : 0,
    typeFilter !== 'all' ? 1 : 0,
    dateFilter !== 'all' || (dateRange.from && dateRange.to) ? 1 : 0
  ].reduce((sum, current) => sum + current, 0);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  return (
    <Popover open={showFilters} onOpenChange={setShowFilters}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 relative"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>

          {activeFilterCount > 0 && (
            <Badge
              className="ml-1 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center px-1 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter By Status</h4>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter By Type</h4>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Filter By Date</h4>
            <RadioGroup
              value={dateFilter}
              onValueChange={(value) => {
                setDateFilter(value);
                if (value !== 'custom') {
                  setDateRange({ from: undefined, to: undefined });
                }
                setShowDateRangePicker(value === 'custom');
              }}
              className="gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="all"
                  id="all"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="all">All Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="today"
                  id="today"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="today">Today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yesterday"
                  id="yesterday"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="yesterday">Yesterday</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="lastWeek"
                  id="lastWeek"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="lastWeek">Last 7 Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="lastMonth"
                  id="lastMonth"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="lastMonth">Last 30 Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="h-3.5 w-3.5 rounded-[0.25rem] bg-muted border-0 data-[state=checked]:bg-muted before:hidden after:hidden flex items-center justify-center"
                >
                  <Check className="h-2.5 w-2.5 hidden data-[state=checked]:block text-muted-foreground" />
                </RadioGroupItem>
                <Label htmlFor="custom">Custom Range</Label>
              </div>
            </RadioGroup>

            {showDateRangePicker && (
              <div className="rounded-md border p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">From</span>
                      <span className="text-sm text-muted-foreground">
                        {dateRange.from ? format(dateRange.from, 'PPP') : 'Pick a date'}
                      </span>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">To</span>
                      <span className="text-sm text-muted-foreground">
                        {dateRange.to ? format(dateRange.to, 'PPP') : 'Pick a date'}
                      </span>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetFilters();
              setDateRange({ from: undefined, to: undefined });
              setShowDateRangePicker(false);
            }}
            disabled={activeFilterCount === 0}
          >
            Reset Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
