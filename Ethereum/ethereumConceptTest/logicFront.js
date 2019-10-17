var contCandidate = 1;
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account = '0xCba44c817428dE56EA5b22AC64087a7dF9d9C655';
var listOfCandidatesWValue = new Object ();
bytecode = '608060405234801561001057600080fd5b5060405161043d38038061043d8339810180604052602081101561003357600080fd5b81019080805164010000000081111561004b57600080fd5b8281019050602081018481111561006157600080fd5b815185602082028301116401000000008211171561007e57600080fd5b5050929190505050806000908051906020019061009c9291906100a3565b5050610115565b8280548282559060005260206000209081019282156100df579160200282015b828111156100de5782518255916020019190600101906100c3565b5b5090506100ec91906100f0565b5090565b61011291905b8082111561010e5760008160009055506001016100f6565b5090565b90565b610319806101246000396000f3fe608060405234801561001057600080fd5b5060043610610074576000357c0100000000000000000000000000000000000000000000000000000000900480632f265cf714610079578063392e6678146100c15780637021939f14610107578063b13c744b1461014f578063cc9ab26714610191575b600080fd5b6100a56004803603602081101561008f57600080fd5b81019080803590602001909291905050506101bf565b604051808260ff1660ff16815260200191505060405180910390f35b6100ed600480360360208110156100d757600080fd5b81019080803590602001909291905050506101fd565b604051808215151515815260200191505060405180910390f35b6101336004803603602081101561011d57600080fd5b8101908080359060200190929190505050610255565b604051808260ff1660ff16815260200191505060405180910390f35b61017b6004803603602081101561016557600080fd5b8101908080359060200190929190505050610275565b6040518082815260200191505060405180910390f35b6101bd600480360360208110156101a757600080fd5b8101908080359060200190929190505050610298565b005b60006101ca826101fd565b15156101d557600080fd5b6001600083815260200190815260200160002060009054906101000a900460ff169050919050565b600080600090505b60008054905081101561024a578260008281548110151561022257fe5b9060005260206000200154141561023d576001915050610250565b8080600101915050610205565b50600090505b919050565b60016020528060005260406000206000915054906101000a900460ff1681565b60008181548110151561028457fe5b906000526020600020016000915090505481565b6102a1816101fd565b15156102ac57600080fd5b600180600083815260200190815260200160002060008282829054906101000a900460ff160192506101000a81548160ff021916908360ff1602179055505056fea165627a7a7230582020d59ae2a069804323c11efe5200876665cb925864ed5ca0c313e642a04cf3030029';
abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
contract = new web3.eth.Contract(abi);
flag = false;

function addCandidate(){
    var candidateName = document.getElementById("candidateNameInput");
    var table = document.getElementById("tableCandidates");
    var row = table.insertRow(contCandidate);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = contCandidate;
    cell2.innerHTML = candidateName.value;
    cell3.innerHTML = "0";
    cell3.id = "candidato-" + contCandidate;
    contCandidate++; 
    candidateName.value = "";
    if( !flag ){
        flag = true;
        document.getElementById("initProcessBtn").disabled = !flag;
    }
}

function initProcess(){
    var candidateName = document.getElementById("tableCandidates");
    //INHABILITO/HABILITO BOTONES
    document.getElementById("registrarBtn").disabled = true;
    document.getElementById("initProcessBtn").disabled = true;
    document.getElementById("seleccionCandidato").disabled = false;
    document.getElementById("votarBtn").disabled = false;
    var listOfCandidates = new Array();

    var candidates = document.getElementById("seleccionCandidato");
    for (i = 1; i < contCandidate; i++){
        var oCells = candidateName.rows.item(i).cells;
        var option = document.createElement("option");
        option.text = oCells.item(1).innerHTML;
        candidates.add(option);
        listOfCandidates[i-1] = option.text;
        listOfCandidatesWValue[listOfCandidates[i-1]] = 'candidato-' + i;
        }
    
    console.log(listOfCandidatesWValue);

    //INICIO DEL PROCESO DE LANZAR EL CONTRATO
    contract.deploy({
        data: bytecode,
        arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
        }).send({
        from: '0xCba44c817428dE56EA5b22AC64087a7dF9d9C655',
        gas: 1500000,
        gasPrice: web3.utils.toWei('0.00003', 'ether')
        }).then((newContractInstance) => {
        contract.options.address = newContractInstance.options.address
        console.log(newContractInstance.options.address) // instance with the new contract address
        });
}

function voteForCandidate() {
    candidateName = document.getElementById("seleccionCandidato").value;
    console.log(candidateName);
    contract.methods.voteForCandidate(web3.utils.asciiToHex(candidateName)).send({from: account}).then((f) => {
   
     let div_id = listOfCandidatesWValue[candidateName];   
     contract.methods.totalVotesFor(web3.utils.asciiToHex(candidateName)).call().then((f) => {   
      $("#" + div_id).html(f);
   
     })
   
    })
   
   }

$(document).ready(function() {
    candidateNames = Object.keys(listOfCandidatesWValue);
    for(var i=0; i<candidateNames.length; i++) {
        let name = candidateNames[i];
    contract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call().then((f) => {
     $("#" + candidates[name]).html(f);
    })
    }
   });