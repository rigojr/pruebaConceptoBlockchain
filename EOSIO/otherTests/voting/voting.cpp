#include <eosio/eosio.hpp>

using namespace eosio;

class [[eosio::contract("voting")]] voting : public eosio::contract {
    public:
        voting(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

        [[eosio::action]]
        void insert(name user, std::string full_name){
            require_auth( _self );
            candidate_index candidates( get_self(), get_first_receiver().value );
            auto iterator = candidates.find(user.value);
            if ( iterator == candidates.end())
            {
                candidates.emplace(user, [&]( auto& row ) {
                    row.key = user;
                    row.full_name = full_name;
                    row.vote = 0;
                });
            } else {
                print( "Ya esta registrado el candidato >>>, ", user);
            }
            
        }

        [[eosio::action]]
        void vote(name user){
            candidate_index candidates( get_self(), get_first_receiver().value );
            auto iterator = candidates.find(user.value);
            if (iterator == candidates.end())
            {
                print( "No existe candidato, ", user);
            }else
            {
                candidates.modify(iterator, user, [&]( auto& row ){
                    row.vote = row.vote + 1;
                });
            }        
        }

        [[eosio::action]]
        void totalvotes(name user){
            candidate_index candidates( get_self(), get_first_receiver().value );
            auto iterator = candidates.find(user.value);
            if (iterator == candidates.end())
            {
                print( "No existe candidato, ", user);
            }else
            {
                auto candidate = candidates.get(user.value);
                print( "Votos del candidato ",user,">>>", candidate.vote);
            }
        }

        [[eosio::action]]
        void erase(name user) {
            require_auth(user);
            candidate_index candidates( get_self(), get_first_receiver().value );
            auto iterator = candidates.find(user.value);
            check(iterator != candidates.end(), "Record does not exist");
            candidates.erase(iterator);
        }

    private:
        struct [[eosio::table]] person {
            name key;
            std::string full_name;
            int vote = 0;
            uint64_t primary_key() const { return key.value; }
        };
        typedef eosio::multi_index<"people"_n, person> candidate_index;
};
