#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract]] hello : public contract {
    public:
        using contract::contract;
        uint64_t id = 0;
        hello(){
            id = 1;
        }

    [[eosio::action]]
        void hi( name user ) {
            require_auth( user );
            print( "Hello, ", user," Id Test = ", id);
        }
};
