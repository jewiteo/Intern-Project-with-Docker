import React, { Component} from 'react';

import {
    EuiBasicTable,
    EuiSpacer,
    EuiFieldSearch,
    EuiForm,
    EuiFormRow,
    EuiFieldText,
    EuiButton,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSelect,
} from '@elastic/eui';

var languages = ["ENGLISH", "CHINESE", "MALAY", "TAMIL", "KOREAN","THAI"];
var oldSearchId;

class AcronymList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            acronyms: [],
            searchTerm: '',

            pageIndex: 0,
            pageSize: 10,
            totalItemCount: 0,

            searchLoading: false,
            isMounted: false,
        };

    }

    async componentDidMount() {

        if (!this.state.isMounted) {
            const { searchTerm, pageIndex, pageSize } = this.state;
            const params = this.getRequestParams(searchTerm, pageIndex, pageSize);
            await this.retrieveAcronym(params);
            this.setState({ isMounted: true });
        }
    }

    async retrieveAcronym(params) {

        if (params.search) {
            if (languages.includes(params.search.toUpperCase())) {
                //console.log("Found languages");
                const response = await fetch('/api/acronym/all/language/' + params.search.toUpperCase() +
                    '?offset=' + params.offset + '&limit=' + params.pageSize);
                const data = await response.json();
                const responseSize = await fetch('/api/acronym/all/language/' + params.search.toUpperCase() + '/count');
                const totalRecord = await responseSize.json();
                this.setState({ acronyms: data, totalItemCount: totalRecord });
            } else {
                const response = await fetch('/api/acronym/all/' + params.search +
                    '?offset=' + params.offset + '&limit=' + params.pageSize);
                const data = await response.json();
                const responseSize = await fetch('/api/acronym/all/' + params.search + '/count');
                const totalRecord = await responseSize.json();
                this.setState({ acronyms: data, totalItemCount: totalRecord });
            }
        } else {
            const response = await fetch('/api/acronym/all?offset=' + params.offset + '&limit=' + params.pageSize);
            const data = await response.json();
            const responseSize = await fetch('/api/acronym/all/count');
            const totalRecord = await responseSize.json();

            this.setState({ acronyms: data, totalItemCount: totalRecord });
        }
    }

    getRequestParams(searchTerm, pageIndex, pageSize) {
        let params = {};
        let offset = 0;

        if (searchTerm) {
            params["search"] = searchTerm;
        }

        params["page"] = pageIndex ;
        offset = (pageIndex) * pageSize;
        params["offset"] = offset;

        params["pageSize"] = pageSize;
        
        return params;
    }

    async remove(id) {

        const { searchTerm, pageIndex, pageSize, acronyms } = this.state;

        await fetch('/api/acronym/all/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        await fetch('api/acronym/changes/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (acronyms.length === 1 && pageIndex !== 0) {
            const params = this.getRequestParams(searchTerm, pageIndex - 1, pageSize);
            console.log(params);
            await this.retrieveAcronym(params);
            this.setState({ pageIndex: pageIndex - 1 });
        } else {
            const params = this.getRequestParams(searchTerm, pageIndex, pageSize);
            console.log(params);

            await this.retrieveAcronym(params);
        }
    }

    async addNewAcronym(acronymInput, full_termInput, remarkInput, language) {
        const { searchTerm, pageIndex, pageSize } = this.state;

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

        const params = this.getRequestParams(searchTerm, pageIndex, pageSize);
        await this.retrieveAcronym(params);
    } 

    addAcronymForm = () => {

        return (
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiFormRow label="Acronym">
                        <EuiFieldText inputRef={input => {
                            this.acronymInput = input;
                        }} />
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Full Term" helpText="The full term of the acronym">
                        <EuiFieldText inputRef={input => {
                            this.full_termInput = input;
                        }}/>
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Remarks" helpText="Any comments/things to note">
                        <EuiFieldText inputRef={input => {
                            this.remarkInput = input;
                        }}/>
                    </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiFormRow label="Language">
                        <EuiSelect
                            inputRef={input => {
                                this.language = input;
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
                            console.log(this.acronymInput);
                            console.log(this.full_termInput);
                            console.log(this.remarkInput);
                            console.log(this.language);
                            this.addNewAcronym(this.acronymInput.value, this.full_termInput.value, this.remarkInput.value, this.language.value);
                            this.acronymInput.value = "";
                            this.full_termInput.value = "";
                            this.remarkInput.value = "";
                            this.language.value = "ENGLISH";
                        }}>Save</EuiButton>
                    </EuiFormRow>
                </EuiFlexItem>
            </EuiFlexGroup>
       );
    }

    render() {

        const { pageSize, pageIndex, totalItemCount, acronyms, searchLoading } = this.state;
        const pageOfItems = acronyms;

        let actions = null;
        if(pageOfItems.find)
        actions = [
            {
                name: (item) => (item.id ? 'Delete' : 'Remove'),
                icon: 'trash',
                color: 'danger',
                type: 'icon',
                onClick: (item) => {
                    console.log(item.id);
                    this.remove(item.id);
                }
            },
            {
                name: 'Edit',
                //isPrimary: true,
                icon: 'pencil',
                type: 'icon',
                onClick: (item) => {
                    console.log(item);
                    this.setState({ isEditingId: item.id });
                },
                available: (item) => {
                    if (item.id == this.state.isEditingId) {
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
                    if (item.id == this.state.isEditingId) {
                        return true;
                    } else {
                        return false;
                    }
                },
                onClick: (item) => {
                    console.log("This should save:");
                    console.log("Editted Acronym: " + this.editAcronym.value);
                    console.log("Editted full term: " + this.editFull_term.value);
                    console.log("Editted remark: " + this.editRemark.value);

                    var updatedAcronym = {
                        acronym: this.editAcronym.value || '',
                        full_term: this.editFull_term.value|| '',
                        remark: this.editRemark.value || '',
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

                    let updatedAcronymIndex = [...this.state.acronyms].findIndex(i => i.id == item.id);
                    let updatedData = this.state.acronyms;
                    updatedData[updatedAcronymIndex] = updatedAcronym;
                    this.setState({ acronyms: updatedData });
                    this.setState({ isEditingId: "" });
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
            this.setState({ searchLoading: true });

            var tempSearchTerm = e.target.value;
            if (oldSearchId !== null) {
                clearTimeout(oldSearchId);
            }

            const onSearchTerm = setTimeout(() => {
                console.log(tempSearchTerm);
                this.setState({ searchTerm: tempSearchTerm, pageIndex: 0 });

                const { searchTerm, pageIndex, pageSize } = this.state;
                const formattedParams = this.getRequestParams(searchTerm, pageIndex, pageSize);
                this.retrieveAcronym(formattedParams);
                this.setState({ searchLoading: false });
            }, 1000);

            oldSearchId = onSearchTerm;
        }

        const onTableChange = ({ page = {} }) => {

            if (this.state.isMounted) {
                const { searchTerm } = this.state;
                const { index: pageIndex, size: pageSize } = page;
                const params = this.getRequestParams(searchTerm,pageIndex, pageSize);
                this.retrieveAcronym(params);

                this.setState({
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                });
            }

        };

        const columns = [
            {
                field: 'acronym',
                name: 'Acronym',
                render: (value,record) => {
                    
                    if (record.id === this.state.isEditingId) {

                        return (<EuiFieldText inputRef={input => {
                            this.editAcronym = input;
                            if (this.state.isEditingId== record.id )
                                this.editAcronym.defaultValue = value || "";
                        }} />);
                    }
                    return (value);

                }
                
            },
            {
                field: 'full_term',
                name: 'Full Term',
                render: (value, record) => {
                    if (record.id == this.state.isEditingId) {

                        return (<EuiFieldText inputRef={input => {
                            this.editFull_term = input;
                            if (this.state.isEditingId==record.id)
                                this.editFull_term.defaultValue = value || "";
                        }} />);
                    }
                    return (value);

                }
                
            },
            {
                field: 'remark',
                name: 'Remarks',
                render: (value,record) => {
                    
                    if (record.id == this.state.isEditingId) {
                        this.editRemark = value;
                        return (<EuiFieldText inputRef={input => {
                            this.editRemark = input;
                            if (this.state.isEditingId == record.id)
                                this.editRemark.defaultValue = value || "";
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
           
            <div className="table">
                <EuiSpacer size="xl" />
                    {this.addAcronymForm()}
                <EuiSpacer size="xl" />
                <EuiFieldSearch
                    placeholder="Search..."
                    fullWidth
                    isLoading={ searchLoading }
                    onChange={(e) => onSearch(e)}
                />
                <EuiSpacer size="xl" />
                <EuiBasicTable
                    items={pageOfItems}
                    columns={columns}
                    pagination={pagination}
                    onChange={onTableChange}
                    loading={ searchLoading }
                />
            </div>
        );


    }

}
export default AcronymList;