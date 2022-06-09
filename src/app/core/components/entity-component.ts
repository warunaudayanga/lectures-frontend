/* eslint-disable no-empty-function */
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import { AppService } from "../../app.service";
import { DialogService } from "../modules/dialog";
import { HttpError, IObject, IPaginatedResponse, IStatusResponse } from "../interfaces";
import { PromptOptions, PromptResponse, ViewOptions } from "../modules/dialog/interfaces";
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
import { FormControlData } from "../modules/form-validation/interfaces";
import { GetAllDto } from "../dto/get-all.dto";

export abstract class EntityComponent<Entity extends IObject & BaseEntity, cols extends number = any, SubEntity = IObject> {

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

    protected onInit(): void {}

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

    protected onGetAll(response: any): IPaginatedResponse<Entity> {
        return response as unknown as IPaginatedResponse<Entity>;
    };

    protected afterGetAll(response: IPaginatedResponse<Entity>): void {};

    protected generateFormDialog(formData: FormControlData<Entity, any>[], update?: boolean): EventEmitter<PromptResponse> {
        const options: PromptOptions<Entity, SubEntity> = {
            title: `${update ? "Update" : "New"} ${toFirstCase(this.options.name)}`,
            formData,
            icon: `icofont ${update ? "icofont-ui-edit" : "icofont-ui-add"}`,
            colorClass: "app-primary",
            buttons: { ok: update ? "Update" : "Save" },
            wait: true,
            width: "550px",
        };
        return this.dialog.prompt(options);
    }

    public getAll(): void {
        this.loading = true;
        const getAllDto: GetAllDto<Entity> = {
            page: this.page,
            limit: this.limit,
            keyword: this.keyword,
            sort: this.sort,
        };
        this.entityService.getAll(getAllDto)
            .subscribe({
                next: res => {
                    const response = this.onGetAll(res);
                    this.data.dataSource = response.data;
                    this.data.totalItems = response.rowCount;
                    this.dataTable.update();
                    this.afterGetAll(response);
                    this.loading = false;
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    this.loading = false;
                    AppService.log(err);
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
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                AppService.log(err);
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
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                this.app.stopLoading();
                                AppService.log(err);
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
                error: (error: HttpError<EnumValue & CommonError>) => {
                    this.data.dataSource[index] = backup;
                    this.app.error(error.error?.message ?? CommonError.ERROR);
                    AppService.log(error);
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
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                AppService.log(err);
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
