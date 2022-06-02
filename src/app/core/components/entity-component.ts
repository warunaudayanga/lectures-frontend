/* eslint-disable no-empty-function */
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import { AppService } from "../../app.service";
import { DialogService } from "../modules/dialog";
import { ErrorResponse, HttpError, IObject, IPaginatedResponse, IStatusResponse } from "../interfaces";
import { FormControlData, PromptOptions, PromptResponse, ViewOptions } from "../modules/dialog/interfaces";
import { Subject } from "rxjs";
import { EventEmitter } from "@angular/core";
import { DialogLevel } from "../modules/dialog/enums";
import { DataTable, DataTableData } from "../modules/data-table/interfaces";
import { Service } from "../services";
import { BaseEntity } from "../entity";
import { CommonError, Status } from "../enums";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { toFirstCase } from "../utils";
import { Sort, SortFields } from "../modules/data-table/interfaces/sort-fields.interface";

export abstract class EntityComponent<Entity extends BaseEntity & IObject, cols extends number = any, SubEntity = IObject> {

    public abstract dataTable: DataTable

    public loading: boolean = false;

    public page: number = 1;

    public limit!: number;

    public keyword: string = "";

    public sort?: Sort<Entity>;

    public data!: DataTableData<Entity, cols, SubEntity>;

    public dataChangeListener: Subject<boolean> = new Subject<boolean>();

    protected constructor(
        protected app: AppService,
        protected dialog: DialogService,
        protected entityService: Service<Entity>,
        protected options: { name: string, key: string },
    ) {
        // this.socketService.onEvent<Entity>(options.name)?.subscribe(entity => this.onEvent(entity));
    }

    protected abstract onInit(): void;

    protected abstract formData(entity?: any): FormControlData<Entity, SubEntity>[];

    protected abstract viewDialogData(entity: Entity): ViewOptions<Entity, number, SubEntity>

    public afterDataTableInit(limit: number): void {
        this.limit = limit;
        this.getAll();
        this.onInit();
    }

    // protected onEvent(entity: Entity): void {
    //     const existingEntity = this.entityService.entities.find(e => e.id === entity.id);
    //     if (existingEntity) {
    //         this.entityService.entities[this.entityService.entities.indexOf(existingEntity)] = entity;
    //     } else {
    //         this.entityService.entities.push(entity);
    //     }
    //     // this.entityService.entities.sort((a, b) => {
    //     //     const sa = String(a[this.options.key as keyof Entity]).toLowerCase();
    //     //     const sb = String(b[this.options.key as keyof Entity]).toLowerCase();
    //     //     if ( sa < sb ){
    //     //         return -1;
    //     //     }
    //     //     if ( sa > sb ){
    //     //         return 1;
    //     //     }
    //     //     return 0;
    //     // });
    //     this.getAll();
    // };

    public add(): void {
        this.addDialog(this.formData());
    }

    public edit(entity: Entity): void {
        this.editDialog(entity, this.formData(entity));
    }

    public view(entity: Entity): void {
        this.viewDialog(this.viewDialogData(entity));
    }

    protected beforeAdd(formValues: any, data?: Partial<Entity>): Entity {
        return { ...formValues, ...data };
    }

    protected beforeEdit(formValues: any, data?: Partial<Entity>): Entity {
        return { ...formValues, ...data };
    }

    protected afterAdd(entity: Entity): void {};

    protected afterEdit(successResponse: IStatusResponse): void {};

    protected afterGetAll(response: IPaginatedResponse<Entity>): void {};

    protected generateFormDialog(formData: FormControlData<Entity, any>[], update?: boolean): EventEmitter<PromptResponse> {
        const options: PromptOptions<IStatusResponse, undefined> = {
            title: `New ${toFirstCase(this.options.name)}`,
            formData,
            icon: "icofont icofont-ui-add",
            colorClass: "app-primary",
            buttons: { ok: update ? "Update" : "Save" },
            wait: true,
            width: "550px",
        };
        return this.dialog.prompt(options);
    }

    public getAll(): void {
        this.loading = true;
        this.entityService.getAll(this.page, this.limit, this.keyword, this.sort)
            .subscribe({
                next: res => {
                    this.data.dataSource = res.data;
                    this.data.totalItems = res.rowCount;
                    this.dataTable.update();
                    this.afterGetAll(res);
                    this.loading = false;
                },
                error: (err: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                    this.loading = false;
                    AppService.log(err);
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                },
            });

    }

    protected viewDialog<cols extends number = any, SubEntity = IObject>(options: ViewOptions<Entity, cols, SubEntity>): void {
        this.app.viewDialog(options);
    }

    protected addDialog<SubEntity = IObject>(formData: FormControlData<Entity, SubEntity>[], data?: Partial<Entity>): void {
        this.generateFormDialog(formData)
            .subscribe(response => {
                if (response.form.valid) {
                    this.app.startLoading();
                    this.entityService.create(this.beforeAdd(response.form.value, data))
                        .subscribe({
                            next: entity => {
                                response.prompt.close();
                                this.app.stopLoading();
                                this.app.success(`New ${this.options.name} added successfully`);
                                this.afterAdd(entity);
                                this.getAll();
                            }, error: (err: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                                AppService.log(err);
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                this.app.stopLoading();
                            },
                        });
                }
            });
    }

    protected editDialog<SubEntity = IObject>(entity: Entity, formData: FormControlData<Entity, SubEntity>[], data?: Partial<Entity>): void {
        this.generateFormDialog(formData, true)
            .subscribe((response: PromptResponse) => {
                if (response.form.valid) {
                    this.app.startLoading();
                    this.entityService.update(entity.id, this.beforeEdit(response.form.value, data))
                        .subscribe({
                            next: successResponse => {
                                response.prompt.close();
                                this.app.stopLoading();
                                this.app.success(`${toFirstCase(this.options.name)} updated successfully`);
                                this.afterEdit(successResponse);
                                this.getAll();
                            }, error: (err: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                                AppService.log(err);
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                this.app.stopLoading();
                            },
                        });
                }
            });
    }

    public changeStatus(entity: Entity): void {
        const backup = { ...entity };
        const index = this.data.dataSource.indexOf(entity);
        // this.data.dataSource[index].status = !backup.status;
        this.data.dataSource[index].status = backup.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
        this.entityService.changeStatus(entity.id, entity.status)
            .subscribe({
                error: (error: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                    this.data.dataSource[index] = backup;
                    AppService.log(error);
                    this.app.error(error.error?.message ?? CommonError.ERROR);
                },
            } );
    }

    public delete(entity: Entity): void {
        this.dialog.confirm(`Are you sure you want to delete ${this.options.name} '${this.options.name}'`, DialogLevel.WARNING)
            .subscribe(result => {
                if (result) {
                    this.entityService.delete(entity.id)
                        .subscribe({
                            next: () => {
                                this.app.success(`${toFirstCase(this.options.name)} '${entity[this.options.key as keyof Entity]}' was deleted successfully`);
                                this.entityService.entities = this.entityService.entities?.filter(e => e.id !== entity.id);
                                this.getAll();
                                this.dataChangeListener.next(true);
                            }, error: (err: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                                AppService.log(err);
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                            },
                        });
                }
            });
    }

    public onFilter(keyword: string): void {
        this.keyword = keyword;
        this.getAll();
    }

    public onSort(sortFields: SortFields[]): void {
        this.sort = sortFields.map(f => `${String(f.key).split(".")[0]}.${f.direction}`).join(",") as Sort<Entity>;
        this.getAll();
    }

    public changePage(page: number): void {
        this.page = page;
        this.getAll();
    }

}
