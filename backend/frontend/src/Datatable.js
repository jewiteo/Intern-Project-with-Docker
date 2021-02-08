//version: 01
import React, { useEffect, useState } from 'react';

import {
    EuiBasicTable,
    EuiSpacer,
    EuiFieldSearch,
    EuiFormRow,
    EuiFieldText,
    EuiButton,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSelect,
    EuiErrorBoundary,
    EuiGlobalToastList,
} from '@elastic/eui';

var languages = ["ENGLISH", "CHINESE", "MALAY", "TAMIL", "KOREAN", "THAI"];
var oldSearchId;
var toastId = 0;

function Datatable() {
    const [acronyms, setAcronyms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalItemCount, setTotalItemCount] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [editingId, setEditingId] = useState(0);

    const [acronymInput, setAcronymInput] = useState("");
    const [full_termInput, setFull_TermInput] = useState("");
    const [remarkInput, setRemarkInput] = useState("");
    const [language, setLanguage] = useState("ENGLISH");

    const [editAcronym, setEditAcronym] = useState(() => document.createElement('input'));
    const [editFull_Term, setEditFull_Term] = useState(() => document.createElement('input'));
    const [editRemark, setEditRemark] = useState(() => document.createElement('input'));

    const [hasError, setHasError] = useState(null);

    const [toasts, setToasts] = useState([]);

    useEffect(() => {

        const params = getRequestParams(searchTerm, pageIndex, pageSize);
        retrieveAcronym(params);

        const interval = setInterval(() => retrieveAcronym(params), 3000);
        return () => clearInterval(interval);

    }, [searchTerm, pageIndex, pageSize]);



    async function retrieveAcronym(params) {

        if (params.search) {
            if (languages.includes(params.search.toUpperCase())) {

                const response = await fetch('/api/acronym/all/language/' + params.search.toUpperCase() +
                    '?offset=' + params.offset + '&limit=' + params.pageSize);
                if (!response.ok) {
                    setHasError("Error: " + response.statusText);
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                const responseSize = await fetch('/api/acronym/all/language/' + params.search.toUpperCase() + '/count');
                if (!responseSize.ok) {
                    setHasError("Error: " + responseSize.statusText);
                    throw new Error(responseSize.statusText);
                }
                const totalRecord = await responseSize.json();

                setAcronyms(data);
                setTotalItemCount(totalRecord);
            } else {
                const response = await fetch('/api/acronym/all/' + params.search +
                    '?offset=' + params.offset + '&limit=' + params.pageSize);
                if (!response.ok) {
                    setHasError("Error: " + response.statusText);
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                const responseSize = await fetch('/api/acronym/all/' + params.search + '/count');
                if (!responseSize.ok) {
                    setHasError("Error: " + responseSize.statusText);
                    throw new Error(responseSize.statusText);
                }
                const totalRecord = await responseSize.json();

                setAcronyms(data);
                setTotalItemCount(totalRecord);
            }
        } else {
            const response = await fetch('/api/acronym/all?offset=' + params.offset + '&limit=' + params.pageSize);
            if (!response.ok) {
                setHasError("Error: " + response.statusText);
                throw new Error(response.statusText);
            }
            const data = await response.json();
            const responseSize = await fetch('/api/acronym/all/count');
            if (!responseSize.ok) {
                setHasError("Error: " + responseSize.statusText);
                throw new Error(responseSize.statusText);
            }
            const totalRecord = await responseSize.json();

            setAcronyms(data);
            setTotalItemCount(totalRecord);
        }

        setHasError(null);
    }

    function getRequestParams(searchTerm, pageIndex, pageSize) {
        let params = {};
        let offset = 0;

        if (searchTerm) {
            params["search"] = searchTerm;
        }

        params["page"] = pageIndex;
        offset = (pageIndex) * pageSize;
        params["offset"] = offset;

        params["pageSize"] = pageSize;

        return params;
    }

    async function remove(id) {

        await fetch('/api/acronym/all/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (acronyms.length === 1 && pageIndex !== 0) {
            const params = getRequestParams(searchTerm, pageIndex - 1, pageSize);
            console.log(params);
            await retrieveAcronym(params);
            setPageIndex(prevPageIndex => prevPageIndex - 1);

        } else {
            const params = getRequestParams(searchTerm, pageIndex, pageSize);
            console.log(params);

            await retrieveAcronym(params);
        }
    }

    async function addNewAcronym(acronymInput, full_termInput, remarkInput, language) {

        const newAcronym = {
            acronym: acronymInput || "",
            full_term: full_termInput || "",
            remark: remarkInput || "",
            language: language || "ENGLISH",
            creator: "admin", //temporary value 
        };

        console.log(newAcronym);

        await fetch('api/acronym/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAcronym),
        });

        const params = getRequestParams(searchTerm, pageIndex, pageSize);
        await retrieveAcronym(params);
    }

    const addAcronymForm = () => {


        return (
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiFormRow label="Acronym">
                        <EuiFieldText inputRef={input => {
                            setAcronymInput(input);
                        }} />
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Full Term" helpText="The full term of the acronym">
                        <EuiFieldText inputRef={input => {
                            setFull_TermInput(input);
                        }} />
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Remarks" helpText="Any comments/things to note">
                        <EuiFieldText inputRef={input => {
                            setRemarkInput(input);
                        }} />
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Language">
                        <EuiSelect
                            inputRef={input => {
                                setLanguage(input);
                            }}
                            options={languages.map(x => {
                                var o = Object.assign({}, x);
                                o.value = x;
                                o.text = x;
                                return o;
                            })}
                            display='center'
                        />
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiFormRow hasEmptyLabelSpace>
                        <EuiButton onClick={() => {
                            console.log(full_termInput.value);
                            console.log(remarkInput.value);
                            console.log(language.value);

                            if (hasError) {
                                const toast = {
                                    id: `"${toastId++}"`,
                                    title: "Error adding record",
                                    color: "danger",
                                    iconType: "alert",
                                    text: (<p>
                                        Problem connecting to database. Record was not added.
                                    </p>)
                                }
                                setToasts(toasts.concat(toast));
                            } else {
                                if (acronymInput.value.length < 20 && acronymInput.value.length > 0 &&
                                    full_termInput.value.length < 100 && full_termInput.value.length > 0 &&
                                    remarkInput.value.length < 250) {

                                    addNewAcronym(acronymInput.value, full_termInput.value, remarkInput.value, language.value);
                                    acronymInput.value = "";
                                    full_termInput.value = "";
                                    remarkInput.value = "";
                                    language.value = "ENGLISH";

                                    const toast = {
                                        id: `"${toastId++}"`,
                                        title: "Successfully added a new record",
                                        color: "success",
                                        iconType: "plusInCircle",
                                    }
                                    setToasts(toasts.concat(toast));

                                } else {
                                    if (acronymInput.value.length == 0 || full_termInput.value.length == 0) {
                                        const toast = {
                                            id: `"${toastId++}"`,
                                            title: "Error adding record",
                                            color: "danger",
                                            iconType: "alert",
                                            text: (<p>
                                                Missing input in at least one field.
                                            </p>)
                                        }
                                        setToasts(toasts.concat(toast));
                                    } else {
                                        const toast = {
                                            id: `"${toastId + 1}"`,
                                            title: "Error adding record",
                                            color: "danger",
                                            iconType: "alert",
                                            text: (<p>
                                                Inputs are too long, please shorten it
                                            </p>)
                                        }
                                        setToasts(toasts.concat(toast));
                                    }
                                }
                            }
                        }}>Save</EuiButton>
                    </EuiFormRow>
                </EuiFlexItem>
            </EuiFlexGroup>
        );
    }

    let actions = null;
    actions = [
        {
            name: (item) => (item.id ? 'Delete' : 'Remove'),
            icon: 'trash',
            color: 'danger',
            type: 'icon',
            onClick: (item) => {
                console.log(item.id);
                remove(item.id);
                const toast = {
                    id: `"${toastId++}"`,
                    title: "A record has been deleted",
                    color: "warning",
                    iconType: "minusInCircle",
                }
                setToasts(toasts.concat(toast));
            }
        },
        {
            name: 'Edit',
            //isPrimary: true,
            icon: 'pencil',
            type: 'icon',
            onClick: (item) => {
                console.log(item);
                setEditingId(item.id);
            },
            available: (item) => {
                if (item.id == editingId) {
                    return false;
                } else {
                    return true;
                }
            },
            'data-test-subj': 'action-edit',
        },
        {
            name: 'Save',
            icon: 'pencil',
            type: 'icon',
            available: (item) => {
                if (item.id == editingId) {
                    return true;
                } else {
                    return false;
                }
            },
            onClick: (item) => {

               /* 
                console.log("Editted Acronym: " + editAcronym.value);
                console.log("Editted full term: " + editFull_Term.value);
                console.log("Editted remark: " + editRemark.value);
                */

                var updatedAcronym = {
                    acronym: editAcronym.value || '',
                    full_term: editFull_Term.value || '',
                    remark: editRemark.value || '',
                    id: item.id,
                    language: item.language,
                    creator: item.creator,
                }

                fetch('api/acronym/all/' + item.id, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedAcronym),
                });

                let updatedAcronymIndex = acronyms.findIndex(i => i.id == item.id);
                let updatedData = acronyms;
                updatedData[updatedAcronymIndex] = updatedAcronym;
                setAcronyms(updatedData);
                setEditingId(0);

                const toast = {
                    id: `"${toastId++}"`,
                    title: "Successfully editted record",
                    color: "success",
                    iconType: "check",
                }
                setToasts(toasts.concat(toast));


            }
        }

    ];

    const pagination = {
        pageIndex,
        pageSize,
        totalItemCount,
        pageSizeOptions: [5, 10, 20],
    };

    const onSearch = (e) => {
        setSearchLoading(true);

        var tempSearchTerm = e.target.value;
        if (oldSearchId !== null) {
            clearTimeout(oldSearchId);
        }

        const onSearchTerm = setTimeout(() => {
            console.log(tempSearchTerm);
            setSearchTerm(tempSearchTerm);
            setPageIndex(0);
            setSearchLoading(false);

        }, 1000);

        oldSearchId = onSearchTerm;
    }

    const onTableChange = ({ page = {} }) => {

        const { index: pageIndex, size: pageSize } = page;

        setPageIndex(pageIndex);
        setPageSize(pageSize);


    };

    const columns = [
        {
            field: 'acronym',
            name: 'Acronym',
            render: (value, record) => {

                if (record.id === editingId) {
                    return (<EuiFieldText inputRef={input => {
                        if (input !== null) {
                            setEditAcronym(input);
                        }

                        if (editingId === record.id)
                            editAcronym.defaultValue = value || "";
                    }} />);
                }
                return (value);

            }

        },
        {
            field: 'full_term',
            name: 'Full Term',
            render: (value, record) => {
                if (record.id == editingId) {

                    return (<EuiFieldText inputRef={input => {
                        if (input !== null) {
                            setEditFull_Term(input);
                        }

                        if (editingId == record.id)
                            editFull_Term.defaultValue = value || "";
                    }} />);
                }
                return (value);

            }

        },
        {
            field: 'remark',
            name: 'Remarks',
            render: (value, record) => {

                if (record.id == editingId) {

                    return (<EuiFieldText inputRef={input => {
                        if (input !== null) {
                            setEditRemark(input);
                        }

                        if (editingId == record.id)
                            editRemark.defaultValue = value || "";
                    }} />);
                }
                return (value);

            }

        },
        {
            field: 'language',
            name: 'Language',

        },
        {
            field: 'creator',
            name: 'Creator',

        },
        {
            name: 'Actions',
            actions

        }
    ];

    return (
        <EuiErrorBoundary>
            <div className="table">
                <EuiSpacer size="xl" />
                {addAcronymForm()}
                <EuiSpacer size="xl" />
                <EuiFieldSearch
                    placeholder="Search..."
                    fullWidth
                    isLoading={searchLoading}
                    onChange={(e) => onSearch(e)}
                />
                <EuiSpacer size="xl" />
                <EuiBasicTable
                    items={acronyms}
                    error={hasError}
                    columns={columns}
                    pagination={pagination}
                    onChange={onTableChange}
                    loading={searchLoading}
                />
                <EuiGlobalToastList
                    toasts={toasts}
                    toastLifeTimeMs={3000}
                    dismissToast={(removedToast) => {
                        setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
                    }}
                />
            </div>
        </EuiErrorBoundary>
    );


}

export default Datatable;