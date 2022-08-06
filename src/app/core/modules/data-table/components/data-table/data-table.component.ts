// noinspection JSUnusedGlobalSymbols

import {
    AfterContentChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    Output,
    ViewChild,
} from "@angular/core";
import { DataTableData, Func } from "../../interfaces";
import { Observable, Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { VirtualScrollerComponent } from "ngx-virtual-scroller";
import { getDimensions } from "../../utils";
import { environment } from "../../../../../../environments/environment";
import { ShortcutService } from "../../../../services";
import { SortDir, SortIcon } from "../../enums";
import { SortFields } from "../../interfaces/sort-fields.interface";
import { AppService } from "../../../../../app.service";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "data-table",
    templateUrl: "./data-table.component.html",
    styleUrls: ["./data-table.component.scss", "../../../loader/components/loader/loader.component.scss"],
})
export class DataTableComponent implements AfterViewInit, AfterContentChecked, OnDestroy {

    @ViewChild(VirtualScrollerComponent) private virtualScroller!: VirtualScrollerComponent;

    @ViewChild("tableContainer") tableContainer!: ElementRef<HTMLTableElement>;

    @ViewChild("container") tableBody!: ElementRef<HTMLElement>;

    @ViewChild("thead") thead!: ElementRef<HTMLElement>;

    @Input() loading: boolean = false;

    @Input() data: DataTableData<any, number, any> = {} as any;

    @Input() dataChange?: Observable<boolean>;

    @Output() afterInit = new EventEmitter<number>();

    @Output() pageChange = new EventEmitter<number>();

    @Output() filter = new EventEmitter<string>();

    @Output() sort = new EventEmitter<SortFields[]>();

    @Output() option = new EventEmitter<any>();

    @Output() optionA = new EventEmitter<any>();

    @Output() optionB = new EventEmitter<any>();

    @Output() optionC = new EventEmitter<any>();

    @Output() optionD = new EventEmitter<any>();

    @Output() optionE = new EventEmitter<any>();

    dataSource!: any[];

    itemsPerPage: number = 0;

    currentPage: number = 1

    totalItems?: number;

    selectedId?: number;

    init = false;

    onKey: Subscription;

    onDataChange!: Subscription;

    SortIcon = SortIcon

    sortFields: SortFields[] = [];

    constructor(
        @Inject(DOCUMENT) private readonly document: Document,
        private readonly shortcutService: ShortcutService,
        public readonly app: AppService,
    ) {
        this.onKey = shortcutService.onKey()
            .subscribe(shortcut => {
                const selected = this.tableContainer.nativeElement.querySelector("tr.selected");
                if (shortcut.e.code === "ArrowUp") {
                    // shortcutService.click(selected?.previousElementSibling);
                    this.selectAndScroll(selected?.previousElementSibling as HTMLElement | null);
                } else if (shortcut.e.code === "ArrowDown") {
                    // shortcutService.click(selected?.nextElementSibling);
                    this.selectAndScroll(selected?.nextElementSibling as HTMLElement | null);
                } else if (shortcut.e.code === "Space" && shortcut.released) {
                    shortcutService.click(selected?.querySelector("button.btn-app-primary"));
                } else if (shortcut.e.code === "KeyS" && shortcut.released) {
                    shortcutService.select(this.tableContainer.nativeElement?.querySelector(".search"));
                } else if (shortcut.e.key === "Enter" && shortcut.released) {
                    shortcutService.click(selected?.querySelector("button.btn-warning"));
                } else if (shortcut.e.key === "*" && shortcut.released) {
                    shortcutService.click(selected?.querySelector("button.btn-dark"));
                } else if (shortcut.e.code === "Delete" && shortcut.released) {
                    shortcutService.click(selected?.querySelector("button.btn-danger"));
                }
            });
    }

    ngAfterViewInit(): void {
        const tableContainer = this.tableContainer?.nativeElement as HTMLDivElement;
        const innerHeight = getDimensions(tableContainer).height;
        this.itemsPerPage = this.data.option?.itemsPerPage ?? Math.floor(innerHeight / environment.tables.row.height - 3);
        if (this.data.option?.itemsPerPage) {
            tableContainer.style.maxHeight = (innerHeight - innerHeight % environment.tables.row.height - innerHeight % environment.tables.row.height) + "px";
        }
        tableContainer.style.maxHeight = (innerHeight - 55) + "px";
        this.afterInit.emit(this.itemsPerPage);
    }

    ngAfterContentChecked(): void {
        if (!this.init && this.data.dataSource.length) {
            this.dataSource = this.data.dataSource;
            this.totalItems = this.data.totalItems;
            this.selectedId = this.dataSource[0].id;
            this.init = true;
            if (this.dataChange) {
                this.onDataChange = this.dataChange?.subscribe(value => {
                    if (value) {
                        this.dataSource = this.data.dataSource;
                    }
                });
            }
        }
    }

    update(): void {
        this.dataSource = this.data.dataSource;
        this.totalItems = this.data.totalItems;
        this.selectedId = this.dataSource[0]?.id;
    }

    trackItem(index: number, item: any): void {
        return item.id;
    }

    changePage(page: number): void {
        this.currentPage = page;
        // this.selected = 0;
        this.pageChange.emit(page);
    }

    onOption(item?: any, i?: number): void {
        switch (i) {
            case 4: {
                this.optionE.emit(item);
                break;
            }
            case 3: {
                this.optionD.emit(item);
                break;
            }
            case 2: {
                this.optionC.emit(item);
                break;
            }
            case 1: {
                this.optionB.emit(item);
                break;
            }
            case 0: {
                this.optionA.emit(item);
                break;
            }
            default: {
                this.option.emit(item);
            }
        }
    }

    toString(key: string | number | symbol): string {
        return String(key);
    }

    getClass(i: number): string[] {
        return this.data.classOf?.[i + 1] ?? [];
    }

    getValue(item: any, key: string | number | symbol, i: number): string {
        let value = item;
        let keys = String(key).split(".");
        keys.forEach(k => {
            value = value?.[k];
        });

        if (Array.isArray(this.data.formatOf?.[i + 1])) {
            const fns = this.data.formatOf?.[i + 1] as Func[];
            for (const fn of fns) {
                value = fn(value);
            }
            return value;
        }
        // eslint-disable-next-line no-nested-ternary
        return this.data.formatOf?.[i + 1]
            ? (this.data.formatOf?.[i + 1] as Func)?.(value)
            : this.data.format?.[i]
                ? this.data.format?.[i]?.(value)
                : value;


    }

    getStyle(i: number): string {
        let style = "";
        style += `width: ${this.data.widths?.[i] || "auto"};`;
        style += ` text-align: ${this.data.aligns?.[i] || "center"};`;
        return style;
    }

    getColorClass(i?: number): string {
        return (typeof i === "number" ? this.data.option?.common[i].colorClass : this.data.option?.main?.colorClass) ?? "btn-primary";
    }

    getInnerHTML(i?: number): string {
        return (typeof i === "number" ? this.data.option?.common[i].html : this.data.option?.main?.html) ?? "";
    }

    getDisabled(i?: number, id?: string, item?: any): boolean {
        if (id && this.data.disabledIds?.includes(id)) {
            return true;
        }
        const disabled = typeof i === "number" ? this.data.option?.common?.[i]?.disabled : this.data.option?.main?.disabled;
        return typeof disabled === "function" ? disabled(item) : Boolean(disabled);
    }

    scrollToTop(): void {
        const table = this.tableContainer.nativeElement.querySelector(".data-table");
        table?.scrollTo({ top: 0 });
    }

    select(i: number, id: number): void {
        this.selectedId = id;
    }

    selectAndScroll(element: HTMLElement | null): void {
        if (element) {
            element.scrollIntoView({
                behavior: "auto",
                block: "center",
                inline: "center",
            });
            this.selectedId = Number(element.id);
        } else {
            const firstRow = this.document.getElementById(this.dataSource[0].id) as HTMLElement;
            const lastRow = this.document.getElementById(this.dataSource[this.dataSource.length - 1].id) as HTMLElement;

            const rows = this.tableContainer.nativeElement.querySelectorAll("tbody tr") as NodeListOf<HTMLElement>;
            if (firstRow && this.selectedId === this.dataSource[0].id) {
                firstRow.scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center",
                });
            } else if (lastRow && this.selectedId === this.dataSource[this.dataSource.length - 1].id) {
                lastRow.scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center",
                });
            } else {
                const middleRow = rows[Math.floor(rows.length / 2)];
                middleRow.scrollIntoView({
                    behavior: "auto",
                    block: "center",
                    inline: "center",
                });
                this.selectedId = Number(middleRow.id);
            }
        }
    }

    onSearch(keyword: string, e?: Event): void {
        this.filter.emit(keyword);
        // const reKeyword = new RegExp(".*" + keyword + ".*", "i");
        // this.dataSource = this.data.dataSource.filter(item => {
        //     let match = false;
        //     this.data.searchKeys?.forEach(key => {
        //         let value = item;
        //         let keys = String(key).split(".");
        //         keys.forEach(k => {
        //             value = value[k];
        //         });
        //         if (String(value).match(reKeyword)) match = true;
        //     });
        //     return match;
        // });
        if (this.dataSource.length) {
            this.selectedId = this.dataSource[0].id;
            if (e) {
                (e.target as HTMLInputElement).blur();
            }
        }
        this.scrollToTop();
    }

    ngOnDestroy(): void {
        this.onDataChange?.unsubscribe();
    }

    sortData(key: string | number | symbol): void {
        const f = this.sortFields.find(f => f.key === key);
        if (!f) {
            this.sortFields.push({ key, direction: SortDir.ASC });
        } else if (f.direction === SortDir.ASC) {
            this.sortFields = this.sortFields.filter(f => f.key !== key);
            this.sortFields.push({ key, direction: SortDir.DESC });
        } else {
            this.sortFields = this.sortFields.filter(f => f.key !== key);
        }
        this.sort.emit(this.sortFields);
    }

    getSortPriority(key: string | number | symbol): number | undefined {
        const d = this.sortFields.find(f => f.key === key);
        if (d) {
            return this.sortFields.indexOf(d) + 1;
        }
        return undefined;
    }

    getSortIcon(key: string | number | symbol): SortIcon | "" {
        const d = this.sortFields.find(f => f.key === key)?.direction;
        if (d) {
            return SortIcon[d];
        }
        return "";
    }

    fixScroll(): void {
        const transform = this.thead.nativeElement.parentElement?.parentElement?.style.transform;
        if (transform) {
            const translate = transform.split(/\(|px/)?.[1];
            this.thead.nativeElement.style.top = (Number(translate) * -1) + "px";
        }
    }
}
